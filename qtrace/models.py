import os
os.environ["HF_HOME"] = "D:\\hf_cache"
os.environ["HF_HUB_DISABLE_SYMLINKS_WARNING"] = "1"
import gc
from typing import Dict, Any, Tuple, Optional, List
import torch
import torch.nn as nn
from transformers import AutoModelForCausalLM, AutoTokenizer, PreTrainedModel, PreTrainedTokenizer
from qtrace.utils import clean_memory

MODEL_ALIASES = {
    "qwen05": "Qwen/Qwen2.5-0.5B-Instruct",
    "qwen15": "Qwen/Qwen2.5-1.5B-Instruct",
    "qwen-0.5b": "Qwen/Qwen2.5-0.5B-Instruct",
    "qwen-1.5b": "Qwen/Qwen2.5-1.5B-Instruct",
}

class ModelManager:
    """Manages model loading, device placement, weight inspection, and clean unloading."""

    def __init__(self, model_identifier: str = "qwen05", device: str = "auto"):
        self.raw_identifier = model_identifier
        self.resolved_name = MODEL_ALIASES.get(model_identifier.lower(), model_identifier)
        self.device = self._resolve_device(device)
        self.model: Optional[PreTrainedModel] = None
        self.tokenizer: Optional[PreTrainedTokenizer] = None

    def _resolve_device(self, device: str) -> str:
        if device == "auto":
            return "cuda" if torch.cuda.is_available() else "cpu"
        return device

    def load(self) -> Tuple[PreTrainedModel, PreTrainedTokenizer]:
        """Load tokenizer and causal language model into memory with low memory overhead."""
        if self.model is not None and self.tokenizer is not None:
            return self.model, self.tokenizer

        clean_memory()
        print(f"Loading model: {self.resolved_name} on device: {self.device}...")

        self.tokenizer = AutoTokenizer.from_pretrained(
            self.resolved_name,
            trust_remote_code=True,
            padding_side="left"
        )
        if self.tokenizer.pad_token is None:
            self.tokenizer.pad_token = self.tokenizer.eos_token

        # Load weights with low_cpu_mem_usage
        dtype = torch.float16 if self.device == "cuda" else torch.float32
        self.model = AutoModelForCausalLM.from_pretrained(
            self.resolved_name,
            dtype=dtype,
            low_cpu_mem_usage=True,
            trust_remote_code=True
        )
        self.model.to(self.device)
        self.model.eval()

        return self.model, self.tokenizer

    def unload(self) -> None:
        """Safely unload model and tokenizer to release memory."""
        if self.model is not None:
            del self.model
            self.model = None
        if self.tokenizer is not None:
            del self.tokenizer
            self.tokenizer = None
        clean_memory()

    def get_linear_modules(self) -> Dict[str, nn.Linear]:
        """Extract and return all nn.Linear projection layers in the model."""
        if self.model is None:
            raise RuntimeError("Model must be loaded before extracting linear modules.")
        
        linear_layers: Dict[str, nn.Linear] = {}
        for name, module in self.model.named_modules():
            if isinstance(module, nn.Linear):
                linear_layers[name] = module
        return linear_layers

    def get_model_summary(self) -> Dict[str, Any]:
        """Calculate parameter count, layer count, and memory footprint."""
        if self.model is None:
            raise RuntimeError("Model must be loaded before summarizing.")

        total_params = sum(p.numel() for p in self.model.parameters())
        trainable_params = sum(p.numel() for p in self.model.parameters() if p.requires_grad)
        linears = self.get_linear_modules()
        
        # Calculate memory footprint in MB
        param_bytes = sum(p.numel() * p.element_size() for p in self.model.parameters())
        buffer_bytes = sum(b.numel() * b.element_size() for b in self.model.buffers())
        footprint_mb = round((param_bytes + buffer_bytes) / (1024**2), 2)

        return {
            "model_name": self.resolved_name,
            "device": self.device,
            "total_parameters": total_params,
            "trainable_parameters": trainable_params,
            "linear_layer_count": len(linears),
            "memory_footprint_mb": footprint_mb
        }
