import pytest

from services.simulation_service import calculate_simulation


def test_calculates_savings_and_payback():
    result = calculate_simulation(
        current_electricity_kwh=1000,
        current_water_m3=100,
        current_fuel_liters=50,
        electricity_reduction_percent=10,
        water_reduction_percent=20,
        fuel_reduction_percent=0,
        electricity_price_per_kwh=2,
        water_price_per_m3=5,
        fuel_price_per_liter=10,
        improvement_cost=1000,
        period_type="monthly",
    )

    assert result["electricity_saved_kwh"] == 100
    assert result["water_saved_m3"] == 20
    assert result["fuel_saved_liters"] == 0
    assert result["estimated_money_saved_per_period"] == 300
    assert result["payback_periods"] == pytest.approx(3.33)
    assert result["payback_period_unit"] == "month"


def test_zero_savings_has_no_payback_period():
    result = calculate_simulation(
        current_electricity_kwh=0,
        current_water_m3=0,
        current_fuel_liters=0,
        electricity_reduction_percent=10,
        water_reduction_percent=10,
        fuel_reduction_percent=10,
        electricity_price_per_kwh=2,
        water_price_per_m3=5,
        fuel_price_per_liter=10,
        improvement_cost=1000,
        period_type="monthly",
    )

    assert result["estimated_money_saved_per_period"] == 0
    assert result["payback_periods"] is None


def test_invalid_period_type_is_rejected():
    with pytest.raises(ValueError):
        calculate_simulation(
            current_electricity_kwh=100,
            current_water_m3=10,
            current_fuel_liters=5,
            electricity_reduction_percent=10,
            water_reduction_percent=10,
            fuel_reduction_percent=10,
            electricity_price_per_kwh=2,
            water_price_per_m3=5,
            fuel_price_per_liter=10,
            improvement_cost=100,
            period_type="yearly",
        )