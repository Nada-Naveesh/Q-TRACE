"""
Q-TRACE: Quantization Trace, Reliability, Calibration and Adaptive Precision
Investigating Information Loss and Factual Reliability Degradation in Quantized Small Language Models.
"""

__version__ = "1.0.0"
__author__ = "Q-TRACE Research Team"

from qtrace.quantization import QTraceQuantizer
from qtrace.models import ModelManager
from qtrace.datasets import DatasetManager
from qtrace.sensitivity import SensitivityAnalyzer
from qtrace.repair import QuantizationRepair
from qtrace.adaptive import AdaptivePrecisionEngine
from qtrace.metrics import MetricsEngine

__all__ = [
    "QTraceQuantizer",
    "ModelManager",
    "DatasetManager",
    "SensitivityAnalyzer",
    "QuantizationRepair",
    "AdaptivePrecisionEngine",
    "MetricsEngine",
]
