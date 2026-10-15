"""Pure calculation functions. No hidden prices or savings."""


RESOURCES = {
    "electricity_kwh": "kWh",
    "water_m3": "m3",
    "fuel_liters": "liter",
}


def calculate_costs(consumption: dict, unit_prices: dict) -> dict:
    resources = {}
    missing_prices = []
    total = 0.0

    for key, unit in RESOURCES.items():
        amount = consumption.get(key)
        price = unit_prices.get(key)

        if amount is None:
            continue

        if amount < 0 or (price is not None and price < 0):
            raise ValueError(
                f"{key}: consumption and price cannot be negative"
            )

        if price is None:
            missing_prices.append(key)
            cost = None
        else:
            cost = round(amount * price, 2)
            total += cost

        resources[key] = {
            "consumption": amount,
            "unit": unit,
            "unit_price": price,
            "cost": cost,
            "source": "calculated from user-provided consumption and price",
        }

    return {
        "resources": resources,
        "total_cost": round(total, 2),
        "total_is_partial": bool(missing_prices),
        "missing_prices": missing_prices,
    }


def simulate_reduction(
    baseline: float,
    unit_price: float,
    reduction_percent: float,
) -> dict:
    if baseline < 0 or unit_price < 0:
        raise ValueError("baseline and unit_price cannot be negative")

    if not 0 <= reduction_percent <= 100:
        raise ValueError("reduction_percent must be between 0 and 100")

    projected = baseline * (1 - reduction_percent / 100)

    return {
        "baseline_consumption": baseline,
        "projected_consumption": round(projected, 2),
        "baseline_cost": round(baseline * unit_price, 2),
        "projected_cost": round(projected * unit_price, 2),
        "scenario_cost_difference": round(
            (baseline - projected) * unit_price, 2
        ),
        "label": (
            "SCENARIO ESTIMATE: the reduction is a user-supplied "
            "hypothesis, not a prediction or a detected saving."
        ),
    }