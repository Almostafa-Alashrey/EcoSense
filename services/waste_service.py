"""Rule-based waste detection. Pure functions: no FastAPI, no database."""
from statistics import mean, pstdev

RESOURCE_UNITS = {
    "electricity_kwh": "kWh",
    "water_m3": "m3",
    "fuel_liters": "liter",
}

# Configurable RULE thresholds (not industry benchmarks).
DEFAULT_WARNING_PERCENT = 10.0
DEFAULT_HIGH_PERCENT = 25.0
DEFAULT_MIN_HISTORY = 3

SEVERITY = {"insufficient_data": 0, "normal": 1, "warning": 2, "high": 3}

CHECKS = {
    "electricity_kwh": [
        "Compare production volume and operating hours with the previous periods.",
        "Check for equipment left running outside working hours (lighting, compressors, HVAC).",
        "Review recent maintenance or faults on motors, cooling and compressed-air systems.",
        "Check whether tariffs, meter readings or billing periods changed.",
    ],
    "water_m3": [
        "Look for leaks: compare night-time or weekend meter readings with working hours.",
        "Check cooling-tower, cleaning and process-water usage for changes.",
        "Verify the meter reading and billing period are correct.",
        "Compare with production volume for the period.",
    ],
    "fuel_liters": [
        "Compare fuel use with production, deliveries or vehicle/boiler operating hours.",
        "Check for burner, boiler or engine maintenance issues.",
        "Review fuel-purchase and tank-level records for recording errors.",
        "Check for unauthorized or unrecorded use.",
    ],
}


def _validate_thresholds(warning: float, high: float, min_history: int) -> None:
    if warning <= 0:
        raise ValueError("warning threshold must be greater than 0")
    if high <= warning:
        raise ValueError("high threshold must be greater than the warning threshold")
    if min_history < 2:
        raise ValueError("min_history must be at least 2")


def _financial_impact(status: str, current: float, baseline: float | None, price: float | None) -> dict:
    if status == "insufficient_data":
        return {"available": False, "reason": "No reliable baseline, so no cost impact can be calculated."}
    if status not in ("warning", "high"):
        return {"available": False, "reason": "No unusual increase was flagged."}
    if price is None:
        return {"available": False, "reason": "No unit price provided; cost impact not calculated."}
    return {
        "available": True,
        "unit_price": price,
        "additional_cost_vs_baseline": round((current - baseline) * price, 2),
        "label": (
            "Cost of the increase versus the historical average, at the price you provided. "
            "This is NOT confirmed waste and NOT a verified saving."
        ),
    }


def analyze_resource(
    resource: str,
    current: float,
    history: list[float | None],
    unit_price: float | None = None,
    warning_percent: float = DEFAULT_WARNING_PERCENT,
    high_percent: float = DEFAULT_HIGH_PERCENT,
    min_history: int = DEFAULT_MIN_HISTORY,
) -> dict:
    _validate_thresholds(warning_percent, high_percent, min_history)
    if current < 0:
        raise ValueError(f"{resource}: consumption cannot be negative")
    unit = RESOURCE_UNITS[resource]
    clean = [h for h in history if h is not None]

    base = {
        "resource": resource,
        "unit": unit,
        "current_consumption": current,
        "history_periods_used": len(clean),
        "confirmed_waste": False,
    }

    def insufficient(reason: str, recs: list[str]) -> dict:
        return {
            **base,
            "status": "insufficient_data",
            "finding": "unknown",
            "baseline_consumption": None,
            "percentage_change": None,
            "baseline_variability_percent": None,
            "explanation": reason,
            "recommendations": recs,
            "financial_impact": _financial_impact("insufficient_data", current, None, unit_price),
        }

    if len(clean) < min_history:
        return insufficient(
            f"Only {len(clean)} previous period(s) available; at least {min_history} are needed "
            "for a baseline. No baseline was invented.",
            [f"Add consumption records for earlier periods (at least {min_history})."],
        )

    baseline = mean(clean)
    if baseline <= 0:
        return insufficient(
            "The historical average is zero, so a percentage change is undefined.",
            ["Check that the historical records are complete and not zero by mistake."],
        )

    change = (current - baseline) / baseline * 100
    variability = pstdev(clean) / baseline * 100

    if change >= high_percent:
        status = "high"
    elif change >= warning_percent:
        status = "warning"
    else:
        status = "normal"

    direction = "above" if change >= 0 else "below"
    explanation = (
        f"Current consumption ({current} {unit}) is {abs(change):.1f}% {direction} the average of "
        f"{len(clean)} previous periods ({baseline:.2f} {unit})."
    )
    if status in ("warning", "high"):
        threshold = high_percent if status == "high" else warning_percent
        explanation += (
            f" This exceeds the {threshold}% {status} threshold. An increase alone does not prove "
            "waste: it may be caused by higher production, seasonality, weather or meter/billing "
            "differences. Treat it as a potential inefficiency to investigate."
        )
        if variability >= warning_percent:
            explanation += (
                f" Note: past periods varied by about {variability:.1f}% on their own, "
                "so this change may be within normal fluctuation."
            )
        recs = (
            ["Prioritise investigating this resource."] if status == "high" else []
        ) + CHECKS[resource]
    else:
        explanation += f" This is within the +{warning_percent}% threshold; nothing unusual detected."
        recs = ["No action needed. Keep recording consumption every period."]

    return {
        **base,
        "status": status,
        "finding": "potential_inefficiency" if status in ("warning", "high") else "none",
        "baseline_consumption": round(baseline, 2),
        "percentage_change": round(change, 2),
        "baseline_variability_percent": round(variability, 2),
        "explanation": explanation,
        "recommendations": recs,
        "financial_impact": _financial_impact(status, current, baseline, unit_price),
    }


def detect_waste(
    current: dict,
    history: dict,
    prices: dict | None = None,
    warning_percent: float = DEFAULT_WARNING_PERCENT,
    high_percent: float = DEFAULT_HIGH_PERCENT,
    min_history: int = DEFAULT_MIN_HISTORY,
) -> dict:
    """current: {resource: value or None}; history: {resource: [values]}; prices: {resource: price}."""
    prices = prices or {}
    results, not_submitted = {}, []

    for resource in RESOURCE_UNITS:
        value = current.get(resource)
        if value is None:
            not_submitted.append(resource)
            continue
        results[resource] = analyze_resource(
            resource, value, history.get(resource, []), prices.get(resource),
            warning_percent, high_percent, min_history,
        )

    if not results:
        raise ValueError("At least one resource consumption value is required")

    insufficient = [k for k, r in results.items() if r["status"] == "insufficient_data"]
    analyzable = [r["status"] for r in results.values() if r["status"] != "insufficient_data"]
    overall = max(analyzable, key=SEVERITY.get) if analyzable else "insufficient_data"

    return {
        "overall_status": overall,
        "confirmed_waste": False,
        "resources": results,
        "not_submitted": not_submitted,
        "resources_with_insufficient_data": insufficient,
        "settings_used": {
            "warning_threshold_percent": warning_percent,
            "high_threshold_percent": high_percent,
            "min_history_periods": min_history,
            "note": "Configurable rule thresholds, not industry benchmarks.",
        },
        "disclaimer": (
            "Results flag unusual changes versus this company's own history. They are potential "
            "inefficiencies to investigate, not confirmed waste or guaranteed savings."
        ),
    }