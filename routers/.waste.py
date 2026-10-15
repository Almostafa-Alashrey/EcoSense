from datetime import date, timedelta

from fastapi import APIRouter, Depends, HTTPException
from fastapi.encoders import jsonable_encoder
from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from database import get_db
from deps import get_current_user
from models import AnalysisResult, ConsumptionRecord
from schemas_waste import WasteDetectionRequest
from services.waste_service import RESOURCE_UNITS, detect_waste

router = APIRouter(prefix="/waste", tags=["waste detection"])

PRICE_FIELDS = {
    "electricity_kwh": "electricity_price_per_kwh",
    "water_m3": "water_price_per_m3",
    "fuel_liters": "fuel_price_per_liter",
}


def get_period_start(period_type: str, period_date: date) -> date:
    if period_type == "daily":
        return period_date
    if period_type == "weekly":
        return period_date - timedelta(days=period_date.weekday())
    if period_type == "monthly":
        return period_date.replace(day=1)
    if period_type == "yearly":
        return period_date.replace(month=1, day=1)
    raise ValueError("Unsupported period type")


@router.post("/detect")
def detect(
    data: WasteDetectionRequest,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    company_id = user.company_id
    period = get_period_start(
        data.period_type,
        data.period_date or date.today(),
    )

    records = db.scalars(
        select(ConsumptionRecord)
        .where(
            ConsumptionRecord.company_id == company_id,
            ConsumptionRecord.period_type == data.period_type,
            ConsumptionRecord.period_date < period,
        )
        .order_by(ConsumptionRecord.period_date.desc())
        .limit(data.lookback_periods)
    ).all()

    history = {
        resource: [getattr(record, resource, None) for record in records]
        for resource in RESOURCE_UNITS
    }
    current = {
        resource: getattr(data, resource)
        for resource in RESOURCE_UNITS
    }
    prices = {
        resource: getattr(data, PRICE_FIELDS[resource])
        for resource in RESOURCE_UNITS
    }

    try:
        analysis = detect_waste(
            current,
            history,
            prices,
            data.warning_threshold_percent,
            data.high_threshold_percent,
            data.min_history_periods,
        )
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc

    sources: dict[str, int] = {}
    for record in records:
        label = getattr(record, "data_source", None) or "unknown"
        sources[label] = sources.get(label, 0) + 1

    response = {
        "period_date": period,
        "period_type": data.period_type,
        **analysis,
        "provenance": {
            "current_consumption_and_prices": "user-provided in this request",
            "baseline": (
                "calculated from this company's stored records "
                "of the same period type before the analyzed period"
            ),
            "history_records_used": len(records),
            "history_data_sources": sources,
            "baseline_includes_non_measured_data": any(
                source != "measured" for source in sources
            ),
        },
        "analysis_id": None,
    }
    response = jsonable_encoder(response)

    if data.save_result:
        try:
            row = AnalysisResult(
                company_id=company_id,
                result={
                    "type": "waste_detection",
                    **{
                        key: value
                        for key, value in response.items()
                        if key != "analysis_id"
                    },
                },
            )
            db.add(row)
            db.commit()
            db.refresh(row)
            response["analysis_id"] = row.id
        except SQLAlchemyError as exc:
            db.rollback()
            raise HTTPException(
                status_code=500,
                detail="Could not save the analysis result",
            ) from exc

    return response