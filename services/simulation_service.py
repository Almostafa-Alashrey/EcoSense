def calculate_simulation(
    current_electricity_kwh: float,
    current_water_m3: float,
    current_fuel_liters: float,
    electricity_reduction_percent: float,
    water_reduction_percent: float,
    fuel_reduction_percent: float,
    electricity_price_per_kwh: float,
    water_price_per_m3: float,
    fuel_price_per_liter: float,
    improvement_cost: float,
    period_type: str = "monthly",
):
    electricity_saved = (
        current_electricity_kwh * electricity_reduction_percent / 100
    )
    water_saved = current_water_m3 * water_reduction_percent / 100
    fuel_saved = current_fuel_liters * fuel_reduction_percent / 100

    money_saved = (
        electricity_saved * electricity_price_per_kwh
        + water_saved * water_price_per_m3
        + fuel_saved * fuel_price_per_liter
    )

    period_units = {
        "daily": "day",
        "weekly": "week",
        "monthly": "month",
    }

    if period_type not in period_units:
        raise ValueError(
            "period_type must be daily, weekly, or monthly"
        )

    payback_periods = None

    if money_saved > 0:
        payback_periods = improvement_cost / money_saved

    return {
        "period_type": period_type,
        "electricity_saved_kwh": round(electricity_saved, 2),
        "water_saved_m3": round(water_saved, 2),
        "fuel_saved_liters": round(fuel_saved, 2),
        "estimated_money_saved_per_period": round(money_saved, 2),
        "improvement_cost": round(improvement_cost, 2),
        "payback_periods": (
            round(payback_periods, 2)
            if payback_periods is not None
            else None
        ),
        "payback_period_unit": period_units[period_type],
        "note": (
            "Estimates only. Payback uses the selected period. "
            "If savings are zero, payback cannot be calculated."
        ),
    }