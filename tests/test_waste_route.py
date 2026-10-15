from datetime import date
from types import SimpleNamespace

from conftest import TestingSessionLocal
from models import Company, ConsumptionRecord
from schemas_waste import WasteDetectionRequest
from routers.waste import detect


def test_waste_uses_matching_period_and_company(client):
    db = TestingSessionLocal()

    try:
        company_a = Company(name="Test Company A")
        company_b = Company(name="Test Company B")
        db.add_all([company_a, company_b])
        db.commit()
        db.refresh(company_a)
        db.refresh(company_b)

        for month in (1, 2, 3, 4):
            db.add(
                ConsumptionRecord(
                    company_id=company_a.id,
                    period_type="monthly",
                    period_date=date(2026, month, 1),
                    electricity_kwh=100.0,
                    water_m3=0,
                    fuel_liters=0,
                    data_source="measured",
                )
            )

        db.add(
            ConsumptionRecord(
                company_id=company_a.id,
                period_type="daily",
                period_date=date(2026, 4, 20),
                electricity_kwh=9999.0,
                water_m3=0,
                fuel_liters=0,
                data_source="measured",
            )
        )

        db.add(
            ConsumptionRecord(
                company_id=company_b.id,
                period_type="monthly",
                period_date=date(2026, 4, 1),
                electricity_kwh=8888.0,
                water_m3=0,
                fuel_liters=0,
                data_source="measured",
            )
        )
        db.commit()

        request = WasteDetectionRequest(
            period_date=date(2026, 5, 15),
            period_type="monthly",
            electricity_kwh=110.0,
            lookback_periods=6,
            min_history_periods=3,
            save_result=False,
        )

        result = detect(
            data=request,
            db=db,
            user=SimpleNamespace(company_id=company_a.id),
        )

        assert result["period_date"] == date(2026, 5, 1).isoformat()
        assert result["period_type"] == "monthly"
        assert result["provenance"]["history_records_used"] == 4

    finally:
        db.close()
