from typing import List, Dict, Any, Optional
import torch
import torch.nn as nn
from transformers import PreTrainedTokenizer
from qtrace.quantization import QTraceQuantizer
from qtrace.attribution import ModuleAttributor

class SensitivityAnalyzer:
    """Performs numerical sensitivity calculation and behavioral one-layer ablation probes."""

    @classmethod
    def compute_numerical_sensitivity(
        cls,
        model: nn.Module,
        bit_width: int = 4,
        group_size: int = 128,
        calib_scales: Optional[Dict[str, torch.Tensor]] = None
    ) -> List[Dict[str, Any]]:
        """Calculate numerical weight error and activation-weighted error for all linear layers."""
        results = []

        for name, module in model.named_modules():
            if not isinstance(module, nn.Linear):
                continue

            mod_type = ModuleAttributor.categorize_module_name(name)
            w = module.weight.data
            calib_factor = calib_scales.get(name) if calib_scales else None

            # Measure quantization error without modifying module permanently
            _, _, metrics = QTraceQuantizer.quantize_tensor(
                w,
                bit_width=bit_width,
                group_size=group_size,
                granularity="group-wise",
                clipping_method="percentile",
                calib_scale_factor=calib_factor
            )

            # Activation-weighted error if available
            act_scale_mean = float(torch.mean(calib_factor).item()) if calib_factor is not None else 1.0
            act_weighted_err = metrics["rmse"] * act_scale_mean

            results.append({
                "layer": name,
                "module_type": mod_type,
                "weight_rmse": metrics["rmse"],
                "weight_mae": metrics["mae"],
                "relative_error": metrics["rel_err"],
                "max_error": metrics["max_err"],
                "activation_weighted_error": act_weighted_err,
                "param_count": w.numel()
            })

        # Sort descending by activation-weighted error or relative error
        results.sort(key=lambda x: x["activation_weighted_error"], reverse=True)
        for idx, item in enumerate(results):
            item["rank"] = idx + 1

        return results

    @classmethod
    def run_one_layer_ablation(
        cls,
        model: nn.Module,
        tokenizer: PreTrainedTokenizer,
        probe_prompt: str,
        top_k_layers: int = 6,
        bit_width: int = 4,
        group_size: int = 128,
        device: str = "cpu"
    ) -> List[Dict[str, Any]]:
        """
        One-Layer Ablation Probe (Section 17):
        For top candidate layers, quantize ONLY that layer to INT4, measure output logit divergence
        against full FP16 baseline, then immediately restore the layer to FP16.
        """
        # 1. Baseline FP16 forward pass
        inputs = tokenizer(probe_prompt, return_tensors="pt").to(device)
        model.eval()
        with torch.no_grad():
            fp16_outputs = model(**inputs)
            fp16_logits = fp16_outputs.logits[:, -1, :].float()
            fp16_probs = torch.softmax(fp16_logits, dim=-1)

        # 2. Get top candidates from numerical sensitivity
        numerical = cls.compute_numerical_sensitivity(model, bit_width=bit_width, group_size=group_size)
        candidates = numerical[:top_k_layers]

        ablation_results = []

        for cand in candidates:
            layer_name = cand["layer"]
            # Locate target layer
            target_module = dict(model.named_modules()).get(layer_name)
            if target_module is None or not isinstance(target_module, nn.Linear):
                continue

            # Backup original weight
            orig_w = target_module.weight.data.clone()

            # Quantize ONLY this layer
            quant_w, _, _ = QTraceQuantizer.quantize_tensor(
                orig_w, bit_width=bit_width, group_size=group_size
            )
            target_module.weight.data.copy_(quant_w)

            # Measure single-layer quantized inference output
            with torch.no_grad():
                abl_outputs = model(**inputs)
                abl_logits = abl_outputs.logits[:, -1, :].float()
                abl_probs = torch.softmax(abl_logits, dim=-1)

            # Measure KL divergence and top-1 token change
            kl_div = float(torch.sum(fp16_probs * (torch.log(fp16_probs + 1e-12) - torch.log(abl_probs + 1e-12))).item())
            top1_fp16 = int(torch.argmax(fp16_probs, dim=-1).item())
            top1_abl = int(torch.argmax(abl_probs, dim=-1).item())
            token_changed = (top1_fp16 != top1_abl)

            # Restore layer back to original FP16 immediately
            target_module.weight.data.copy_(orig_w)

            ablation_results.append({
                "layer": layer_name,
                "module_type": cand["module_type"],
                "weight_rmse": cand["weight_rmse"],
                "single_layer_kl_div": kl_div,
                "top1_token_changed": token_changed,
                "behavioral_delta": kl_div
            })

        ablation_results.sort(key=lambda x: x["single_layer_kl_div"], reverse=True)
        return ablation_results
