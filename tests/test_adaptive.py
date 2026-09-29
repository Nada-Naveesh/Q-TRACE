from qtrace.adaptive import AdaptivePrecisionEngine

def test_adaptive_routing_logic():
    engine = AdaptivePrecisionEngine(
        entropy_threshold=1.15,
        confidence_threshold=0.65
    )

    # 1. Low risk should be accepted at INT4
    risk_low, _ = engine.evaluate_uncertainty(mean_confidence=0.92, min_confidence=0.80, mean_entropy=0.35)
    assert risk_low == "low_risk"

    # 2. Medium risk should escalate to INT8
    risk_med, _ = engine.evaluate_uncertainty(mean_confidence=0.60, min_confidence=0.55, mean_entropy=0.70)
    assert risk_med == "medium_risk"

    # 3. High risk should escalate to FP16
    risk_high, _ = engine.evaluate_uncertainty(mean_confidence=0.45, min_confidence=0.20, mean_entropy=1.50)
    assert risk_high == "high_risk"

def test_routing_summary_rates():
    history = [
        {"selected_precision": "INT4", "latency": 0.05},
        {"selected_precision": "INT4", "latency": 0.05},
        {"selected_precision": "INT8", "latency": 0.08},
        {"selected_precision": "FP16", "latency": 0.15},
    ]
    summary = AdaptivePrecisionEngine.calculate_routing_summary(history)
    assert summary["total_queries"] == 4
    assert summary["int4_acceptance_rate"] == 0.50 # 2/4
    assert summary["adaptive_escalation_rate"] == 0.50 # 2/4 (INT8 + FP16)
    assert summary["fp16_escalation_rate"] == 0.25 # 1/4

if __name__ == "__main__":
    test_adaptive_routing_logic()
    test_routing_summary_rates()
    print("Adaptive precision unit tests passed successfully!")
