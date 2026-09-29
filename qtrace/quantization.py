import math
from typing import Dict, Any, Tuple, Optional, List
import torch
import torch.nn as nn

class QTraceQuantizer:
    """
    Q-TRACE Group-wise Quantizer
    Transparent, verifiable research-grade quantizer supporting symmetric group-wise,
    per-channel, and per-tensor integer quantization with optional clipping and reconstruction metrics.
    """

    ENGINE_NAME = "Q-TRACE Group-wise Quantizer"

    @staticmethod
    def quantize_tensor(
        tensor: torch.Tensor,
        bit_width: int = 4,
        group_size: int = 128,
        granularity: str = "group-wise",
        clipping_method: str = "percentile",
        clipping_percentile: float = 99.5,
        calib_scale_factor: Optional[torch.Tensor] = None
    ) -> Tuple[torch.Tensor, torch.Tensor, Dict[str, float]]:
        """
        Quantize a float tensor to signed integer (INT4 or INT8) and return dequantized float tensor,
        scale factors, and reconstruction metrics.
        """
        orig_shape = tensor.shape
        orig_dtype = tensor.dtype
        device = tensor.device

        # Determine signed integer bounds
        qmin = -(2 ** (bit_width - 1))
        qmax = (2 ** (bit_width - 1)) - 1

        w = tensor.clone().float()

        # 1. Apply Optional Clipping
        if clipping_method == "percentile" and clipping_percentile < 100.0:
            flat_abs = torch.abs(w).flatten()
            k = int(len(flat_abs) * (clipping_percentile / 100.0))
            k = max(1, min(k, len(flat_abs) - 1))
            clip_val = torch.kthvalue(flat_abs, k).values
            w = torch.clamp(w, -clip_val, clip_val)
        elif clipping_method == "calibration_based" and calib_scale_factor is not None:
            # Scale-aware clipping
            w = w * calib_scale_factor.to(device)

        # 2. Reshape according to Granularity
        if granularity == "per-tensor":
            max_val = torch.max(torch.abs(w))
            scale = max_val / qmax if max_val > 1e-8 else torch.tensor(1.0, device=device)
            w_int = torch.clamp(torch.round(w / scale), qmin, qmax)
            w_dequant = (w_int * scale).to(orig_dtype)

        elif granularity == "per-channel":
            # Per output-channel (dim 0)
            max_val = torch.amax(torch.abs(w), dim=tuple(range(1, w.ndim)), keepdim=True)
            scale = torch.where(max_val > 1e-8, max_val / qmax, torch.ones_like(max_val))
            w_int = torch.clamp(torch.round(w / scale), qmin, qmax)
            w_dequant = (w_int * scale).to(orig_dtype)

        else: # "group-wise"
            flat_w = w.reshape(-1)
            num_elements = flat_w.numel()
            actual_group_size = min(group_size, num_elements)
            num_groups = math.ceil(num_elements / actual_group_size)
            padded_size = num_groups * actual_group_size

            if padded_size > num_elements:
                flat_w = torch.nn.functional.pad(flat_w, (0, padded_size - num_elements), value=0.0)

            grouped_w = flat_w.view(num_groups, actual_group_size)
            max_val = torch.amax(torch.abs(grouped_w), dim=1, keepdim=True)
            scale = torch.where(max_val > 1e-8, max_val / qmax, torch.ones_like(max_val))
            grouped_int = torch.clamp(torch.round(grouped_w / scale), qmin, qmax)
            grouped_dequant = grouped_int * scale
            w_dequant = grouped_dequant.view(-1)[:num_elements].view(orig_shape).to(orig_dtype)

        # 3. Calculate Exact Numerical Reconstruction Metrics
        diff = tensor.float() - w_dequant.float()
        abs_err = torch.abs(diff)
        rmse = float(torch.sqrt(torch.mean(diff ** 2)).item())
        mae = float(torch.mean(abs_err).item())
        max_err = float(torch.max(abs_err).item())
        norm_orig = float(torch.norm(tensor.float()).item())
        rel_err = float(torch.norm(diff).item() / (norm_orig + 1e-12))

        metrics = {
            "rmse": rmse,
            "mae": mae,
            "max_err": max_err,
            "rel_err": rel_err,
            "bit_width": bit_width,
            "group_size": group_size,
            "granularity": granularity
        }

        return w_dequant, scale, metrics

    @classmethod
    def quantize_model_linear_layers(
        cls,
        model: nn.Module,
        bit_width: int = 4,
        group_size: int = 128,
        granularity: str = "group-wise",
        clipping_method: str = "percentile",
        clipping_percentile: float = 99.5,
        target_layers: Optional[List[str]] = None,
        calib_data: Optional[Dict[str, torch.Tensor]] = None
    ) -> Dict[str, Dict[str, float]]:
        """
        Quantize specified (or all) Linear layers of a model in-place.
        Backs up original FP16 weights in module._orig_weight for perfect restoration.
        """
        layer_metrics: Dict[str, Dict[str, float]] = {}

        for name, module in model.named_modules():
            if not isinstance(module, nn.Linear):
                continue
            
            # If target_layers is specified, only quantize those
            if target_layers is not None and name not in target_layers:
                continue

            # Backup original weight if not already backed up
            if not hasattr(module, "_orig_weight"):
                module._orig_weight = module.weight.data.clone().detach()

            calib_factor = calib_data.get(name) if calib_data else None

            # Quantize & dequantize weight
            dequant_w, _, metrics = cls.quantize_tensor(
                module.weight.data,
                bit_width=bit_width,
                group_size=group_size,
                granularity=granularity,
                clipping_method=clipping_method,
                clipping_percentile=clipping_percentile,
                calib_scale_factor=calib_factor
            )

            # Assign quantized weight for real model execution
            module.weight.data.copy_(dequant_w)
            layer_metrics[name] = metrics

        return layer_metrics

    @classmethod
    def restore_model_weights(cls, model: nn.Module) -> int:
        """Restore all modified Linear layers back to their original unquantized weights."""
        restored_count = 0
        for name, module in model.named_modules():
            if isinstance(module, nn.Linear) and hasattr(module, "_orig_weight"):
                module.weight.data.copy_(module._orig_weight)
                del module._orig_weight
                restored_count += 1
        return restored_count

    @classmethod
    def apply_progressive_quantization(
        cls,
        model: nn.Module,
        group_size: int = 128
    ) -> Dict[str, Any]:
        """
        Execute progressive quantization pathway:
        FP16 -> INT8 -> INT4
        """
        cls.restore_model_weights(model)
        # Step 1: FP16 -> INT8
        int8_metrics = cls.quantize_model_linear_layers(
            model, bit_width=8, group_size=group_size
        )
        # Step 2: INT8 -> INT4
        int4_metrics = cls.quantize_model_linear_layers(
            model, bit_width=4, group_size=group_size
        )
        return {"int8_metrics": int8_metrics, "int4_metrics": int4_metrics}
