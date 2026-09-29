from typing import Dict, Any, List, Optional, Tuple
import torch
import torch.nn as nn
from qtrace.quantization import QTraceQuantizer
from qtrace.sensitivity import SensitivityAnalyzer
from qtrace.metrics import MetricsEngine

class QuantizationRepair:
    """
    Q-TRACE Quantization Repair
    Restores the top most sensitive modules to higher precision (INT8 or FP16)
    to recover factual reliability while preserving edge efficiency benefits.
    """

    @classmethod
    def apply_selective_repair(
        cls,
        model: nn.Module,
        sensitive_layer_ranks: List[Dict[str, Any]],
        repair_fraction: float = 0.10,
        target_precision: str = "INT8",
        group_size: int = 128
    ) -> Dict[str, Any]:
        """
        Configure mixed-precision model:
        1. Quantize all Linear layers to INT4.
        2. Upgrade the top (repair_fraction * num_layers) sensitive layers to target_precision (INT8 or FP16).
        """
        # Ensure fresh starting state
        QTraceQuantizer.restore_model_weights(model)

        all_linear_names = [name for name, m in model.named_modules() if isinstance(m, nn.Linear)]
        total_layers = len(all_linear_names)
        num_repair_layers = max(1, int(total_layers * repair_fraction))

        # Get sorted names of top sensitive layers
        ranked_names = [item["layer"] for item in sensitive_layer_ranks if item["layer"] in all_linear_names]
        repaired_layer_names = set(ranked_names[:num_repair_layers])
        int4_layer_names = [name for name in all_linear_names if name not in repaired_layer_names]

        # Quantize non-repaired layers to INT4
        int4_metrics = QTraceQuantizer.quantize_model_linear_layers(
            model,
            bit_width=4,
            group_size=group_size,
            target_layers=int4_layer_names
        )

        # Quantize repaired layers to target precision (INT8) or leave as FP16
        if target_precision.upper() == "INT8":
            repaired_metrics = QTraceQuantizer.quantize_model_linear_layers(
                model,
                bit_width=8,
                group_size=group_size,
                target_layers=list(repaired_layer_names)
            )
        else: # FP16: Leave unquantized (full precision)
            repaired_metrics = {}

        return {
            "total_linear_layers": total_layers,
            "repaired_layer_count": len(repaired_layer_names),
            "repair_fraction": repair_fraction,
            "repaired_precision": target_precision,
            "repaired_layers": list(repaired_layer_names),
            "int4_layers_count": len(int4_layer_names)
        }

    @classmethod
    def run_repair_search(
        cls,
        model: nn.Module,
        sensitive_ranks: List[Dict[str, Any]],
        eval_fn: Any, # Callable(model) -> float (reliability)
        fractions: List[float] = [0.05, 0.10, 0.15, 0.20],
        group_size: int = 128
    ) -> List[Dict[str, Any]]:
        """
        Automatic Greedy Repair Search (Section 39):
        Iterates over candidate repair fractions (5%, 10%, 15%, 20%),
        measures reliability recovery and estimates memory overhead.
        """
        search_history = []

        for frac in fractions:
            alloc_info = cls.apply_selective_repair(
                model,
                sensitive_ranks,
                repair_fraction=frac,
                target_precision="INT8",
                group_size=group_size
            )

            # Evaluate model reliability with this allocation
            measured_score = eval_fn(model)

            # Estimate memory overhead relative to pure INT4
            # INT8 takes 2x the weight bits of INT4 for repaired fraction
            mem_overhead_percent = (frac * 1.0) * 100.0 # approximately frac * 100% additional weight memory

            search_history.append({
                "repair_fraction": frac,
                "repaired_layer_count": alloc_info["repaired_layer_count"],
                "measured_score": measured_score,
                "estimated_memory_overhead_percent": mem_overhead_percent
            })

        return search_history
