from contextlib import asynccontextmanager
from datetime import date, timedelta
from typing import Literal

from fastapi import Depends, FastAPI, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from database import get_db, init_db
from deps import get_current_user
from models import Company, ConsumptionRecord, AnalysisResult
from auth_models import User
from routers import auth as auth_router
from routers import simulation as simulation_router
from routers import waste as waste_router
from services.cost_service import calculate_costs


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(
    title="EcoSense API",
    description=(
        "Analyze company resource consumption using "
        "company-provided prices. Missing prices are not guessed."
    ),
    version="0.4.0",
    lifespan=lifespan,
)


class AnalyzeRequest(BaseModel):
    electricity_kwh: float = Field(..., ge=0)
    water_m3: float = Field(..., ge=0)
    fuel_liters: float = Field(..., ge=0)

    electricity_price_per_kwh: float | None = Field(default=None, ge=0)
    water_price_per_m3: float | None = Field(default=None, ge=0)
    fuel_price_per_liter: float | None = Field(default=None, ge=0)

    period_type: Literal["daily", "weekly", "monthly", "yearly"] = "daily"


def get_period_start(period_type: str) -> date:
    today = date.today()

    if period_type == "daily":
        return today

    if period_type == "weekly":
        return today - timedelta(days=today.weekday())

    if period_type == "monthly":
        return today.replace(day=1)

    if period_type == "yearly":
        return today.replace(month=1, day=1)

    raise HTTPException(status_code=422, detail="Invalid period type")


@app.get("/")
def home():
    return {
        "message": "Welcome to EcoSense API",
        "status": "running",
        "docs": "/docs",
    }


@app.post("/analyze")
def analyze_consumption(
    data: AnalyzeRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    company = (
        db.query(Company)
        .filter(Company.id == current_user.company_id)
        .first()
    )

    if company is None:
        raise HTTPException(
            status_code=404,
            detail="Company not found",
        )

    consumption = {
        "electricity_kwh": data.electricity_kwh,
        "water_m3": data.water_m3,
        "fuel_liters": data.fuel_liters,
    }

    unit_prices = {
        "electricity_kwh": data.electricity_price_per_kwh,
        "water_m3": data.water_price_per_m3,
        "fuel_liters": data.fuel_price_per_liter,
    }

    results = calculate_costs(consumption, unit_prices)
    period_start = get_period_start(data.period_type)

    record = (
        db.query(ConsumptionRecord)
        .filter(
            ConsumptionRecord.company_id == company.id,
            ConsumptionRecord.period_type == data.period_type,
            ConsumptionRecord.period_date == period_start,
        )
        .first()
    )

    if record is None:
        record = ConsumptionRecord(
            company_id=company.id,
            period_type=data.period_type,
            period_date=period_start,
            **consumption,
            data_source="measured",
        )
        db.add(record)
    else:
        record.electricity_kwh = data.electricity_kwh
        record.water_m3 = data.water_m3
        record.fuel_liters = data.fuel_liters

    analysis = AnalysisResult(
        company_id=company.id,
        result={
            **results,
            "period_type": data.period_type,
            "period_date": period_start.isoformat(),
        },
    )
    db.add(analysis)

    try:
        db.commit()
    except Exception as exc:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Could not save the analysis",
        ) from exc

    return {
        "company_name": company.name,
        "consumption_saved": True,
        "analysis_saved": True,
        "period_type": data.period_type,
        "period_date": period_start.isoformat(),
        **results,
        "notice": (
            "Enter the total consumption for the selected period. "
            "Costs use company-provided prices. Missing prices are not "
            "estimated. This endpoint does not detect waste or predict "
            "actual savings."
        ),
    }


app.include_router(auth_router.router)
app.include_router(simulation_router.router)
app.include_router(waste_router.router)