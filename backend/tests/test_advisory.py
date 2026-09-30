"""Test suite for Advisory Rule Engine and Multi-lingual NLG."""
from datetime import date
from backend.src.advisory.rule_engine import AdvisoryRuleEngine
from backend.src.advisory.nlg.template_engine import MultiLingualNLG

def test_heavy_rain_rule_flowering():
    engine = AdvisoryRuleEngine()
    advisories = engine.generate_advisories(
        panchayat_id="MH_PUNE_MULSHI_TAMHINI",
        forecast_date=date.today(),
        weather={"temp_max": 28.0, "temp_min": 22.0, "rainfall": 35.0, "humidity": 85.0, "wind_speed": 10.0},
        crop="Rice",
        crop_stage="Flowering & Tillering",
    )
    assert len(advisories) >= 1
    # Check that heavy rain triggered orange alert
    rain_adv = [a for a in advisories if a["id"].endswith("_rain")]
    assert len(rain_adv) == 1
    assert rain_adv[0]["severity"] == "orange"

def test_nlg_multi_languages():
    nlg = MultiLingualNLG()
    params = {"crop": "धान", "stage": "फूल आने की अवस्था", "rainfall": 25.0, "temp_max": 32.0, "humidity": 80.0, "wind_speed": 10.0}
    res_hi = nlg.render_advisory("heavy_rain_flowering", params, language="hi")
    assert "बारिश" in res_hi["message"] or "वर्षा" in res_hi["title"]
    assert res_hi["language"] == "hi"
