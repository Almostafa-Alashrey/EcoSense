import pytest

from services.cost_service import calculate_costs, simulate_reduction


def test_costs_use_provided_prices():
    result = calculate_costs(
        {
            "electricity_kwh": 12000,
            "water_m3": 800,
            "fuel_liters": 3000,
        },
        {
            "electricity_kwh": 0.15,
            "water_m3": 2.5,
            "fuel_liters": 1.2,
        },
    )

    assert result["resources"]["electricity_kwh"]["cost"] == 1800.0
    assert result["total_cost"] == 7400.0
    assert result["total_is_partial"] is False


def test_missing_price_is_reported_not_guessed():
    result = calculate_costs(
        {"electricity_kwh": 1000, "water_m3": 10},
        {"electricity_kwh": 0.2},
    )

    assert result["resources"]["water_m3"]["cost"] is None
    assert result["missing_prices"] == ["water_m3"]
    assert result["total_cost"] == 200.0
    assert result["total_is_partial"] is True


def test_negative_values_rejected():
    with pytest.raises(ValueError):
        calculate_costs(
            {"water_m3": -5},
            {"water_m3": 2.5},
        )


def test_simulation_math():
    result = simulate_reduction(12000, 0.15, 10)

    assert result["projected_consumption"] == 10800.0
    assert result["scenario_cost_difference"] == 180.0


def test_simulation_rejects_bad_percent():
    with pytest.raises(ValueError):
        simulate_reduction(100, 1, 150)