import sys
from typing import Dict, Any, List, Optional

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

def _safe(text: Any) -> str:
    s = str(text)
    enc = sys.stdout.encoding or 'utf-8'
    return s.encode(enc, errors='replace').decode(enc, errors='replace')

class TerminalRenderer:
    """Renders highly readable, structured research outputs, ASCII charts, and failure dossiers to the terminal."""

    BAR_CHAR = "#" # Standard ASCII block character safe across all Windows consoles
    EMPTY_CHAR = "-"

    @classmethod
    def print_banner(cls, model_name: str, dataset_name: str, sample_count: int, mode_name: str = "FAST"):
        print("\n" + "=" * 68)
        print("  Q-TRACE: Quantization Trace, Reliability, Calibration & Adaptive Precision")
        print("  Investigating Information Loss & Factual Degradation in Quantized SLMs")
        print("=" * 68)
        print(f"  MODE:     [{mode_name.upper()} MODE]")
        print(f"  MODEL:    {model_name}")
        print(f"  DATASET:  {dataset_name.upper()} ({sample_count} Evaluation Probes)")
        print("=" * 68 + "\n")

    @classmethod
    def print_section(cls, title: str):
        print(f"\n[{title.upper()}] " + "-" * (60 - len(title)))

    @classmethod
    def print_per_question(
        cls,
        idx: int,
        total: int,
        question: str,
        reference: str,
        fp16_text: str,
        int4_text: str,
        prog_text: str,
        repair_text: str,
        adapt_text: str,
        fp16_corr: bool,
        int4_corr: bool,
        prog_corr: bool,
        repair_corr: bool,
        adapt_corr: bool,
        failure_type: str,
        drift_layer: str,
        recovered: bool
    ):
        print("\n" + "-" * 64)
        print(_safe(f"Probe {idx}/{total}"))
        print(_safe(f"QUESTION:   {question}"))
        print(_safe(f"REFERENCE:  {reference}"))
        print(_safe(f"FP16:       {fp16_text}"))
        print(_safe(f"DIRECT INT4:{int4_text}"))
        print(_safe(f"PROGRESSIVE:{prog_text}"))
        print(_safe(f"REPAIR:     {repair_text}"))
        print(_safe(f"ADAPTIVE:   {adapt_text}"))
        print(_safe(" " * 2 + f"Scores: FP16={'1' if fp16_corr else '0'} | INT4={'1' if int4_corr else '0'} | Prog={'1' if prog_corr else '0'} | Repair={'1' if repair_corr else '0'} | Adapt={'1' if adapt_corr else '0'}"))
        if not int4_corr and fp16_corr:
            print(_safe(f" [!] Failure Identified: {failure_type.upper()}"))
            print(_safe(f"     First Divergence:   {drift_layer}"))
            print(_safe(f"     Recovery Status:    {'RECOVERED' if recovered else 'NOT RECOVERED'}"))
        print("-" * 64)

    @classmethod
    def print_ascii_comparison(cls, title: str, scores: Dict[str, float], max_bar_len: int = 25):
        print(f"\n{title.upper()}")
        print("-" * 45)
        for label, val in scores.items():
            filled_len = int(round(val * max_bar_len))
            filled_len = max(0, min(max_bar_len, filled_len))
            bar_str = cls.BAR_CHAR * filled_len + cls.EMPTY_CHAR * (max_bar_len - filled_len)
            print(f"  {label:<18} {bar_str}  {val:.2f}")
        print("-" * 45)

    @classmethod
    def print_top_sensitive_modules(cls, top_modules: List[Dict[str, Any]], limit: int = 8):
        print("\n" + "=" * 68)
        print("  TOP SENSITIVE MODULES (Numerical & Behavioral)")
        print("=" * 68)
        print(f"  {'Rank':<5} {'Module':<36} {'Module Type':<16} {'Weight RMSE':<10}")
        print("  " + "-" * 64)
        for idx, item in enumerate(top_modules[:limit]):
            rank = item.get("rank", idx + 1)
            name = item["layer"]
            # shorten name if needed
            short_name = name if len(name) <= 34 else "..." + name[-31:]
            mod_type = item.get("module_type", "Linear")
            rmse = item.get("weight_rmse", 0.0)
            print(f"  {rank:<5} {short_name:<36} {mod_type:<16} {rmse:.4f}")
        print("=" * 68)

    @classmethod
    def print_failure_case(
        cls,
        sample_id: str,
        question: str,
        reference: str,
        fp16_text: str,
        int4_text: str,
        error_type: str,
        first_drift_layer: str,
        highest_weight_err_layer: str,
        fp16_conf: float,
        int4_conf: float,
        repair_recovered: bool
    ):
        print("\n" + "=" * 68)
        print("  QUANTIZATION-ASSOCIATED FAILURE CASE")
        print("=" * 68)
        print(_safe(f"  Probe ID:                     {sample_id}"))
        print(_safe(f"  Question:                     {question}"))
        print(_safe(f"  Reference Ground Truth:       {reference}"))
        print(_safe(f"  FP16 Output:                  {fp16_text}"))
        print(_safe(f"  INT4 Output (Degraded):       {int4_text}"))
        print(_safe(f"  Error Classification:         {error_type.upper()}"))
        print(_safe(f"  First Representation Drift:   {first_drift_layer}"))
        print(_safe(f"  Highest Weight Error Layer:   {highest_weight_err_layer}"))
        print(_safe(f"  Confidence Telemetry:         FP16 = {fp16_conf:.2f} | INT4 = {int4_conf:.2f}"))
        print(_safe(f"  Quantization Repair Status:   {'RECOVERED' if repair_recovered else 'NOT RECOVERED'}"))
        print("=" * 68)
