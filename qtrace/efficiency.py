import time
from typing import Dict, Any, List, Optional
import torch
import torch.nn as nn
from transformers import PreTrainedTokenizer
from qtrace.utils import get_hardware_info

class EfficiencyProfiler:
    """Profiles memory consumption, parameter footprint, inference latency, and throughput."""

    @staticmethod
    def estimate_model_memory(
        model: nn.Module,
        bit_width: int = 16,
        group_size: int = 128
    ) -> Dict[str, float]:
        """
        Calculate theoretical and active parameter storage memory in Megabytes.
        """
        total_params = sum(p.numel() for p in model.parameters())
        linear_params = sum(m.weight.numel() for m in model.modules() if isinstance(m, nn.Linear))
        other_params = total_params - linear_params

        # Calculate bit footprint
        linear_bits = linear_params * bit_width
        # scale overhead per group (FP16 scale per group)
        scale_bits = (linear_params / group_size) * 16 if group_size > 0 else 0
        other_bits = other_params * 16 # non-linear weights remain in 16-bit

        total_mb = (linear_bits + scale_bits + other_bits) / (8 * 1024 * 1024)
        fp16_mb = (total_params * 16) / (8 * 1024 * 1024)

        compression_ratio = fp16_mb / max(1e-4, total_mb)

        return {
            "total_parameters": float(total_params),
            "estimated_storage_mb": float(round(total_mb, 2)),
            "fp16_storage_mb": float(round(fp16_mb, 2)),
            "compression_ratio": float(round(compression_ratio, 2)),
            "memory_savings_percent": float(round((1.0 - (total_mb / fp16_mb)) * 100.0, 1))
        }

    @staticmethod
    def measure_latency_and_throughput(
        model: nn.Module,
        tokenizer: PreTrainedTokenizer,
        prompt: str = "Who discovered penicillin and in what year?",
        num_warmup: int = 1,
        num_runs: int = 3,
        max_new_tokens: int = 24,
        device: str = "cpu"
    ) -> Dict[str, float]:
        """Measure real warm inference latency and token throughput."""
        inputs = tokenizer(prompt, return_tensors="pt").to(device)
        model.eval()

        # Warmup
        with torch.no_grad():
            for _ in range(num_warmup):
                model.generate(**inputs, max_new_tokens=max_new_tokens, do_sample=False)

        latencies = []
        tokens_generated = []

        with torch.no_grad():
            for _ in range(num_runs):
                t0 = time.perf_counter()
                out = model.generate(**inputs, max_new_tokens=max_new_tokens, do_sample=False)
                t1 = time.perf_counter()
                latencies.append(t1 - t0)
                gen_len = out.shape[1] - inputs["input_ids"].shape[1]
                tokens_generated.append(gen_len)

        mean_latency = float(sum(latencies) / len(latencies))
        total_tokens = sum(tokens_generated)
        total_time = sum(latencies)
        throughput = float(total_tokens / max(1e-5, total_time))

        return {
            "mean_latency_seconds": round(mean_latency, 4),
            "mean_latency_ms": round(mean_latency * 1000.0, 1),
            "throughput_tokens_per_second": round(throughput, 2)
        }
