import os
import sys
import gc
import json
import random
import platform
from typing import Dict, Any, Optional
import numpy as np
import torch

# Ensure Hugging Face cache defaults to D: drive if exists to avoid C: drive out-of-disk issues
if os.path.exists("D:\\") and "HF_HOME" not in os.environ:
    os.environ["HF_HOME"] = "D:\\hf_cache"

def set_seed(seed: int = 42) -> None:
    """Set random seed across all libraries for deterministic scientific reproducibility."""
    random.seed(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)
    if torch.cuda.is_available():
        torch.cuda.manual_seed_all(seed)
        torch.backends.cudnn.deterministic = True
        torch.backends.cudnn.benchmark = False

def clean_memory() -> None:
    """Garbage collect and release cached GPU/CPU memory."""
    gc.collect()
    if torch.cuda.is_available():
        torch.cuda.empty_cache()

def get_hardware_info() -> Dict[str, Any]:
    """Inspect and return current hardware, framework, and system environment metadata."""
    cuda_avail = torch.cuda.is_available()
    gpu_name = torch.cuda.get_device_name(0) if cuda_avail else "None (CPU Execution)"
    gpu_mem_gb = round(torch.cuda.get_device_properties(0).total_memory / (1024**3), 2) if cuda_avail else 0.0

    return {
        "os": platform.system(),
        "os_release": platform.release(),
        "platform": platform.platform(),
        "python_version": sys.version.split()[0],
        "pytorch_version": torch.__version__,
        "cuda_available": cuda_avail,
        "gpu_name": gpu_name,
        "gpu_memory_gb": gpu_mem_gb,
        "cpu_count": os.cpu_count() or 1,
        "architecture": platform.machine()
    }

def save_json(data: Any, filepath: str) -> None:
    """Save data to JSON with indentation and UTF-8 encoding."""
    os.makedirs(os.path.dirname(os.path.abspath(filepath)), exist_ok=True)
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def load_json(filepath: str) -> Optional[Any]:
    """Load data from JSON file safely."""
    if not os.path.exists(filepath):
        return None
    with open(filepath, 'r', encoding='utf-8') as f:
        return json.load(f)

def ensure_dirs(*dirs: str) -> None:
    """Create directory paths if they do not exist."""
    for d in dirs:
        os.makedirs(d, exist_ok=True)
