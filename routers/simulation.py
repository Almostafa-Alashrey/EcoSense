from typing import Annotated, Literal

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from database import get_db
from deps import get_current_user
from models import SimulationResult
from services.simulation_service import calculate_simulation

router = APIRouter(prefix="/simulation", tags=["What-If Simulator"])

NonNegative = Annotated[float, Field(ge=0, allow_inf_nan=False)]
Percentage = Annotated[float, Field(ge=0, le=100, allow_inf_nan=False)]


class SimulationRequest(BaseModel):
    current_electricity_kwh: NonNegative = 0
    current_water_m3: NonNegative = 0
    current_fuel_liters: NonNegative = 0

    electricity_reduction_percent: Percentage = 0
    water_reduction_percent: Percentage = 0
    fuel_reduction_percent: Percentage = 0

    electricity_price_per_kwh: NonNegative
    water_price_per_m3: NonNegative
    fuel_price_per_liter: NonNegative

    improvement_cost: NonNegative = 0

    period_type: Literal["daily", "weekly", "monthly"] = "monthly"


@router.post("/calculate")
def run_simulation(
    request: SimulationRequest,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        result = calculate_simulation(**request.model_dump())

        saved_result = SimulationResult(
            company_id=current_user.company_id,
            scenarios_input=request.model_dump(),
            result=result,
        )

        db.add(saved_result)
        db.commit()
        db.refresh(saved_result)

        return {
            "simulation_id": saved_result.id,
            "company_id": current_user.company_id,
            "simulation": result,
        }

    except (TypeError, ValueError) as exc:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="Could not calculate simulation with the supplied data.",
        ) from exc
    except Exception as exc:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Could not save the simulation result.",
        ) from exc