from typing import Dict, Any, List
import numpy as np

class MetricsEngine:
    """Computes standardized benchmark metrics, proxy metrics, and Q-TRACE project-defined metrics."""

    @staticmethod
    def compute_reliability_score(
        correctness_rate: float,
        semantic_agreement: float,
        confidence_calibration: float,
        consistency_score: float,
        w_corr: float = 0.50,
        w_sem: float = 0.20,
        w_cal: float = 0.15,
        w_cons: float = 0.15
    ) -> float:
        """
        [PROJECT-DEFINED METRIC]
        Q-TRACE Reliability Score = 0.50*correctness + 0.20*semantic + 0.15*calibration + 0.15*consistency
        """
        score = (
            w_corr * correctness_rate +
            w_sem * semantic_agreement +
            w_cal * confidence_calibration +
            w_cons * consistency_score
        )
        return float(max(0.0, min(1.0, score)))

    @staticmethod
    def compute_quantization_reliability_gap(
        fp16_reliability: float,
        quant_reliability: float
    ) -> Dict[str, float]:
        """
        [PROJECT-DEFINED METRIC]
        Quantization Reliability Gap (QRG) = FP16_rel - Quant_rel
        Normalized QRG = QRG / FP16_rel
        """
        qrg = fp16_reliability - quant_reliability
        norm_qrg = (qrg / fp16_reliability) if fp16_reliability > 1e-6 else 0.0
        return {
            "qrg": float(qrg),
            "normalized_qrg": float(norm_qrg)
        }

    @staticmethod
    def compute_reliability_recovery(
        fp16_reliability: float,
        int4_reliability: float,
        repaired_reliability: float
    ) -> float:
        """
        [PROJECT-DEFINED METRIC]
        Recovery = (Repaired - INT4) / (FP16 - INT4)
        """
        denom = fp16_reliability - int4_reliability
        if abs(denom) < 1e-6:
            return 1.0 if repaired_reliability >= int4_reliability else 0.0
        recovery = (repaired_reliability - int4_reliability) / denom
        return float(max(0.0, min(1.5, recovery))) # Allow up to 150% if repair surpasses FP16

    @staticmethod
    def compute_information_loss_index(
        norm_weight_err: float,
        norm_act_drift: float,
        norm_logit_kl: float,
        norm_token_prob_drift: float,
        w1: float = 0.35,
        w2: float = 0.25,
        w3: float = 0.25,
        w4: float = 0.15
    ) -> float:
        """
        [PROJECT-DEFINED METRIC]
        Information Loss Index (ILI)
        Formula: 0.35*w_err + 0.25*act_drift + 0.25*logit_kl + 0.15*token_prob_drift
        """
        ili = (
            w1 * min(1.0, norm_weight_err) +
            w2 * min(1.0, norm_act_drift) +
            w3 * min(1.0, norm_logit_kl) +
            w4 * min(1.0, norm_token_prob_drift)
        )
        return float(max(0.0, min(1.0, ili)))

    @staticmethod
    def compute_calibration_metrics(
        confidences: List[float],
        correctness: List[bool],
        num_bins: int = 10
    ) -> Dict[str, float]:
        """
        Compute Expected Calibration Error (ECE) and Brier Score.
        """
        if not confidences or not correctness:
            return {"ece": 0.0, "brier_score": 0.0, "calibration_accuracy": 1.0}

        conf_arr = np.array(confidences)
        corr_arr = np.array(correctness, dtype=float)

        # Brier Score = mean((confidence - outcome)^2)
        brier = float(np.mean((conf_arr - corr_arr) ** 2))

        # Expected Calibration Error (ECE)
        bin_boundaries = np.linspace(0, 1, num_bins + 1)
        ece = 0.0

        for i in range(num_bins):
            bin_lower = bin_boundaries[i]
            bin_upper = bin_boundaries[i + 1]
            in_bin = (conf_arr > bin_lower) & (conf_arr <= bin_upper)
            prop_in_bin = np.mean(in_bin)

            if prop_in_bin > 0:
                accuracy_in_bin = np.mean(corr_arr[in_bin])
                avg_confidence_in_bin = np.mean(conf_arr[in_bin])
                ece += np.abs(avg_confidence_in_bin - accuracy_in_bin) * prop_in_bin

        calibration_acc = max(0.0, 1.0 - ece)

        return {
            "ece": float(ece),
            "brier_score": float(brier),
            "calibration_accuracy": float(calibration_acc)
        }
