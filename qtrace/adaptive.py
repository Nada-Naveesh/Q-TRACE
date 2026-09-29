from typing import Dict, Any, List, Optional, Tuple
import torch
import torch.nn as nn
from transformers import PreTrainedTokenizer
from qtrace.generation import TextGenerator

class AdaptivePrecisionEngine:
    """
    Q-TRACE Adaptive Precision Routing Engine
    Routes inputs dynamically: INT4 -> Uncertainty Check -> INT8 (if medium risk) -> FP16 (if high risk).
    """

    def __init__(
        self,
        entropy_threshold: float = 1.15,
        confidence_threshold: float = 0.65,
        top_margin_threshold: float = 0.15
    ):
        self.entropy_threshold = entropy_threshold
        self.confidence_threshold = confidence_threshold
        self.top_margin_threshold = top_margin_threshold

    def evaluate_uncertainty(
        self,
        mean_confidence: float,
        min_confidence: float,
        mean_entropy: float
    ) -> Tuple[str, str]:
        """
        Evaluate risk signals on initial INT4 generation:
        Returns (risk_level, decision_reason).
        """
        if mean_entropy > self.entropy_threshold and min_confidence < (self.confidence_threshold - 0.15):
            return "high_risk", f"High entropy ({mean_entropy:.2f} > {self.entropy_threshold}) & low min confidence ({min_confidence:.2f})"
        elif mean_confidence < self.confidence_threshold or mean_entropy > (self.entropy_threshold - 0.20):
            return "medium_risk", f"Borderline confidence ({mean_confidence:.2f} < {self.confidence_threshold})"
        else:
            return "low_risk", f"Confident output (conf: {mean_confidence:.2f}, entropy: {mean_entropy:.2f})"

    def route_query(
        self,
        prompt: str,
        int4_result: Dict[str, Any],
        int8_fn: Any, # Callable() -> Dict[str, Any]
        fp16_fn: Any  # Callable() -> Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Execute adaptive precision routing on a single query.
        """
        risk_level, reason = self.evaluate_uncertainty(
            int4_result.get("mean_token_confidence", 0.8),
            int4_result.get("min_token_confidence", 0.5),
            int4_result.get("mean_token_entropy", 0.5)
        )

        if risk_level == "low_risk":
            return {
                "selected_precision": "INT4",
                "escalated": False,
                "risk_level": risk_level,
                "reason": reason,
                "final_output": int4_result["generated_text"],
                "latency": int4_result.get("latency_seconds", 0.05),
                "confidence": int4_result.get("mean_token_confidence", 0.8)
            }
        elif risk_level == "medium_risk":
            # Escalate to INT8
            int8_result = int8_fn()
            return {
                "selected_precision": "INT8",
                "escalated": True,
                "risk_level": risk_level,
                "reason": reason,
                "final_output": int8_result["generated_text"],
                "latency": int4_result.get("latency_seconds", 0.05) + int8_result.get("latency_seconds", 0.08),
                "confidence": int8_result.get("mean_token_confidence", 0.85)
            }
        else:
            # Escalate to FP16
            fp16_result = fp16_fn()
            return {
                "selected_precision": "FP16",
                "escalated": True,
                "risk_level": risk_level,
                "reason": reason,
                "final_output": fp16_result["generated_text"],
                "latency": int4_result.get("latency_seconds", 0.05) + fp16_result.get("latency_seconds", 0.15),
                "confidence": fp16_result.get("mean_token_confidence", 0.95)
            }

    @staticmethod
    def calculate_routing_summary(routing_history: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Compute overall Adaptive Precision summary metrics:
        INT4 acceptance rate, INT8 escalation rate, FP16 escalation rate, Adaptive Escalation Rate.
        """
        total = max(1, len(routing_history))
        int4_count = sum(1 for r in routing_history if r["selected_precision"] == "INT4")
        int8_count = sum(1 for r in routing_history if r["selected_precision"] == "INT8")
        fp16_count = sum(1 for r in routing_history if r["selected_precision"] == "FP16")
        escalated_count = int8_count + fp16_count

        return {
            "total_queries": total,
            "int4_accepted_count": int4_count,
            "int4_acceptance_rate": float(int4_count / total),
            "int8_escalated_count": int8_count,
            "int8_escalation_rate": float(int8_count / total),
            "fp16_escalated_count": fp16_count,
            "fp16_escalation_rate": float(fp16_count / total),
            "adaptive_escalation_rate": float(escalated_count / total),
            "mean_adaptive_latency": float(sum(r.get("latency", 0.0) for r in routing_history) / total)
        }
