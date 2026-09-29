import torch
import torch.nn as nn
from typing import Dict, Any, List

class ModuleAttributor:
    """Categorizes transformer layers and analyzes weight distribution profiles and outliers."""

    @staticmethod
    def categorize_module_name(name: str) -> str:
        """Categorize layer into functional transformer module type."""
        lower = name.lower()
        if "embed" in lower:
            return "Embedding"
        elif "q_proj" in lower:
            return "Q projection"
        elif "k_proj" in lower:
            return "K projection"
        elif "v_proj" in lower:
            return "V projection"
        elif "o_proj" in lower:
            return "O projection"
        elif "gate_proj" in lower:
            return "MLP gate"
        elif "up_proj" in lower:
            return "MLP up"
        elif "down_proj" in lower:
            return "MLP down"
        elif "norm" in lower:
            return "Normalization"
        elif "lm_head" in lower:
            return "LM Head"
        elif "mlp" in lower:
            return "MLP General"
        elif "attn" in lower or "attention" in lower:
            return "Attention General"
        else:
            return "Other Linear"

    @classmethod
    def analyze_weight_distribution(cls, tensor: torch.Tensor) -> Dict[str, float]:
        """
        Compute statistical distribution parameters for a weight matrix:
        min, max, mean, std, variance, percentiles (p90, p95, p99, p99.9), outlier ratio (>3 std dev).
        """
        w = tensor.float().flatten()
        mean = float(torch.mean(w).item())
        std = float(torch.std(w).item())
        var = float(torch.var(w).item())
        min_val = float(torch.min(w).item())
        max_val = float(torch.max(w).item())

        abs_w = torch.abs(w)
        abs_mean = float(torch.mean(abs_w).item())
        max_abs = float(torch.max(abs_w).item())
        max_mean_ratio = max_abs / (abs_mean + 1e-12)

        # Percentiles
        sorted_abs, _ = torch.sort(abs_w)
        n = len(sorted_abs)
        p90 = float(sorted_abs[int(n * 0.90)].item())
        p95 = float(sorted_abs[int(n * 0.95)].item())
        p99 = float(sorted_abs[int(n * 0.99)].item())
        p99_9 = float(sorted_abs[min(int(n * 0.999), n - 1)].item())

        # Outlier ratio: fraction of weights whose absolute value exceeds mean + 3*std
        threshold = abs_mean + 3.0 * std
        outliers = torch.sum(abs_w > threshold).item()
        outlier_ratio = float(outliers / n)

        return {
            "min": min_val,
            "max": max_val,
            "mean": mean,
            "std": std,
            "variance": var,
            "max_mean_ratio": max_mean_ratio,
            "p90": p90,
            "p95": p95,
            "p99": p99,
            "p99_9": p99_9,
            "outlier_ratio": outlier_ratio
        }

    @classmethod
    def profile_all_layers(cls, model: nn.Module) -> Dict[str, Dict[str, Any]]:
        """Profile weight distributions across all Linear modules in the model."""
        profiles = {}
        for name, module in model.named_modules():
            if isinstance(module, nn.Linear):
                mod_type = cls.categorize_module_name(name)
                stats = cls.analyze_weight_distribution(module.weight.data)
                stats["module_type"] = mod_type
                profiles[name] = stats
        return profiles
