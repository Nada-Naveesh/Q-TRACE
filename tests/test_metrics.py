from qtrace.metrics import MetricsEngine
from qtrace.tokens import TokenAnalyzer

def test_reliability_score():
    score = MetricsEngine.compute_reliability_score(
        correctness_rate=0.80,
        semantic_agreement=0.85,
        confidence_calibration=0.90,
        consistency_score=0.75
    )
    # 0.50*0.80 + 0.20*0.85 + 0.15*0.90 + 0.15*0.75 = 0.40 + 0.17 + 0.135 + 0.1125 = 0.8175
    assert 0.81 < score < 0.83

def test_quantization_reliability_gap():
    qrg_res = MetricsEngine.compute_quantization_reliability_gap(
        fp16_reliability=0.90,
        quant_reliability=0.70
    )
    assert abs(qrg_res["qrg"] - 0.20) < 1e-5
    assert abs(qrg_res["normalized_qrg"] - (0.20 / 0.90)) < 1e-5

def test_recovery_metric():
    rec = MetricsEngine.compute_reliability_recovery(
        fp16_reliability=0.90,
        int4_reliability=0.60,
        repaired_reliability=0.84
    )
    # (0.84 - 0.60) / (0.90 - 0.60) = 0.24 / 0.30 = 0.80 (80% recovery)
    assert abs(rec - 0.80) < 1e-4

def test_critical_token_stability():
    text_fp16 = "Alexander Fleming discovered penicillin in 1928."
    text_quant = "Alexander Fleming discovered penicillin in 1942."
    diff = TokenAnalyzer.compare_token_sequences(text_fp16, text_quant)
    assert diff["critical_token_stability"] < 1.0
    assert "1928" in diff["lost_critical_tokens"]

def test_information_loss_index():
    ili = MetricsEngine.compute_information_loss_index(
        norm_weight_err=0.4,
        norm_act_drift=0.3,
        norm_logit_kl=0.2,
        norm_token_prob_drift=0.1
    )
    assert 0.0 <= ili <= 1.0

if __name__ == "__main__":
    test_reliability_score()
    test_quantization_reliability_gap()
    test_recovery_metric()
    test_critical_token_stability()
    test_information_loss_index()
    print("All metrics unit tests passed successfully!")
