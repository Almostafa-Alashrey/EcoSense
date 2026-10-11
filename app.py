"""EcoSense API. Run with:  uvicorn app:app --reload"""
import io
import json
import logging
from pathlib import Path

import pandas as pd
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from ecosense import analyze, analyze_records, load_artifacts, what_if
from ref_params import REF, TARIFF_BY_VOLTAGE_EGP

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
logger = logging.getLogger("ecosense.api")

BASE = Path(__file__).parent
ARTIFACTS = load_artifacts(BASE / "artifacts.joblib")  # produced by train.py
DEMO_PATH = BASE / "factory_data_2026.csv"

app = FastAPI(title="EcoSense API", version="1.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])


class AnalyzeRequest(BaseModel):
    records: list[dict]  # one dict per hour, see API_CONTRACT.md
    prices: dict | None = None  # optional overrides of REF keys


class WhatIfRequest(BaseModel):
    recommendation: dict  # one item from /analyze -> recommendations
    saving_pct: float | None = Field(default=None, ge=0, le=1)
    unit_price: float | None = Field(default=None, gt=0)


def _check_prices(prices):
    """Only known keys with positive numbers are allowed."""
    for key, value in (prices or {}).items():
        if key not in REF or not isinstance(value, (int, float)) or value <= 0:
            raise HTTPException(422, f"Invalid price override: {key}")
    return prices


def _parse_prices(text):
    """Prices sent as a JSON string in a form field (used with file upload)."""
    if not text:
        return None
    try:
        prices = json.loads(text)
    except json.JSONDecodeError:
        raise HTTPException(422, "prices must be valid JSON, e.g. {\"tariff_egp_per_kwh\": 2.5}")
    if not isinstance(prices, dict):
        raise HTTPException(422, "prices must be a JSON object")
    return _check_prices(prices)


def _run(func, *args):
    """Run an analysis and map errors to HTTP codes."""
    try:
        return func(*args)
    except ValueError as exc:  # bad input data
        raise HTTPException(422, str(exc))
    except Exception:  # unexpected
        logger.exception("Analysis failed")
        raise HTTPException(500, "Internal error while analyzing the data")


@app.get("/health")
def health():
    return {"status": "ok", "trained_rows": ARTIFACTS["trained_rows"]}


@app.post("/analyze")
def analyze_json(req: AnalyzeRequest):
    return _run(analyze_records, req.records, ARTIFACTS, _check_prices(req.prices))


@app.get("/defaults")
def defaults():
    """Default prices for the input boxes, plus the tariff by voltage level."""
    keys = ["tariff_egp_per_kwh", "water_egp_per_m3", "diesel_egp_per_liter"]
    return {"prices": {k: REF[k] for k in keys}, "tariff_by_voltage_egp": TARIFF_BY_VOLTAGE_EGP}


@app.post("/analyze-csv")
def analyze_csv(file: UploadFile = File(...), prices: str | None = Form(default=None)):
    try:
        raw = pd.read_csv(io.BytesIO(file.file.read()))
    except Exception:
        raise HTTPException(422, "Could not read the file as CSV")
    return _run(analyze, raw, ARTIFACTS, _parse_prices(prices))


@app.get("/demo")
def demo(tariff_egp_per_kwh: float | None = None, water_egp_per_m3: float | None = None,
         diesel_egp_per_liter: float | None = None):
    """Analyze the bundled demo year. Optional query parameters override the default prices."""
    prices = {k: v for k, v in [("tariff_egp_per_kwh", tariff_egp_per_kwh), ("water_egp_per_m3", water_egp_per_m3),
                                ("diesel_egp_per_liter", diesel_egp_per_liter)] if v is not None}
    return _run(analyze, pd.read_csv(DEMO_PATH), ARTIFACTS, _check_prices(prices))


@app.post("/what-if")
def what_if_endpoint(req: WhatIfRequest):
    needed = {"annual_consumption", "capex_egp", "saving_pct", "unit_price", "unit_co2"}
    if not needed.issubset(req.recommendation):
        raise HTTPException(422, f"recommendation must contain {sorted(needed)}")
    return _run(what_if, req.recommendation, req.saving_pct, req.unit_price)
