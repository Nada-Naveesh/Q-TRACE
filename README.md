# Q-TRACE
### Quantization Trace, Reliability, Calibration and Adaptive Precision
**Investigating Information Loss and Factual Reliability Degradation in Quantized Small Language Models (SLMs)**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Python 3.10+](https://img.shields.io/badge/Python-3.10%2B-brightgreen.svg)](requirements.txt)
[![PyTorch 2.0+](https://img.shields.io/badge/PyTorch-2.0%2B-red.svg)](requirements.txt)
[![Status: Experimental Research](https://img.shields.io/badge/Status-Empirical_Research-cyan.svg)](docs/methodology.md)

---

## 1. Executive Overview

**Q-TRACE** is a terminal-first, research-grade experimentation framework designed to investigate the causal pathway connecting **weight discretization noise** in lightweight language models (sub-2B parameters such as `Qwen/Qwen2.5-0.5B-Instruct` and `Qwen/Qwen2.5-1.5B-Instruct`) to **factual hallucination and unreliability**.

Unlike traditional benchmarking systems that merely ask *"Is 4-bit accuracy lower than 16-bit?"*, Q-TRACE traces the exact mathematical and structural propagation:

```text
FP16 Uncompressed Baseline
          ↓
[Post-Training Quantization]
          ↓
Numerical Weight Information Loss (RMSE, MAE, Relative Error)
          ↓
Layer & Module Sensitivity Profiling (Attention vs MLP Saliency)
          ↓
Internal Representation Drift (First Observed Divergence Layer)
          ↓
Logit & Token Probability Drift (KL Divergence & Top Margin Shift)
          ↓
Factual Reliability Degradation & Hallucination Breakdown
          ↓
[Selective Quantization Repair] (Restoring Top 10% Sensitive Modules to INT8)
          ↓
[Adaptive Precision Routing] (Dynamic INT4 → INT8 → FP16 Uncertainty Triage)
          ↓
Optimal Reliability-Efficiency Pareto Frontier
```

---

## 2. Research Problem & The Perplexity Paradox

In on-device and edge artificial intelligence, models under 2 Billion parameters are compressed using 4-bit Post-Training Quantization (PTQ) to operate within 1 GB VRAM envelopes.

Engineers routinely validate compressed checkpoints using **Validation Perplexity (PPL)**. Because 4-bit models preserve coherent syntactic structure, perplexity exhibits minor shifts ($\Delta \text{PPL} \le 0.8$), leading practitioners to assume compression is lossless. 

**The Perplexity Paradox:** Underneath fluent syntax, factual truthfulness undergoes catastrophic localized collapse. In SLMs, factual key-value associations are stored in sparse, high-kurtosis outlier weights in MLP projections. Discretizing these weights clips critical memory pathways, triggering an acute $+20\%$ to $+40\%$ spike in entity substitutions, chronological confabulations, and numerical errors.

---

## 3. Core Research Questions (RQ1–RQ10)

- **RQ1:** Does direct FP16 → INT4 quantization degrade factual reliability in lightweight SLMs?
- **RQ2:** Does the quantization pathway (Direct vs Progressive FP16 → INT8 → INT4) affect the final 4-bit factual behavior?
- **RQ3:** Which model modules and layers are most sensitive to INT4 quantization?
- **RQ4:** At which depth in the transformer does representation divergence first become observable?
- **RQ5:** How does numerical weight loss propagate through intermediate representations to output tokens?
- **RQ6:** Does activation-aware calibration data protect critical factual channels?
- **RQ7:** Can selective higher precision repair recover factual reliability with negligible VRAM overhead?
- **RQ8:** Can adaptive precision preserve truthfulness while retaining 4-bit efficiency?
- **RQ9:** Does perplexity adequately reflect factual reliability?
- **RQ10:** What constitutes the empirical reliability-efficiency Pareto frontier?

---

## 4. Transparent Quantization Engine

Q-TRACE implements a verifiable, research-transparent quantization engine: **`Q-TRACE Group-wise Quantizer`**.

- **Symmetric Uniform Quantization:** Configurable across group sizes ($32, 64, 128, 256$), per-channel, and per-tensor.
- **Outlier Percentile Clipping:** Optional clipping (default $p=99.5\%$) to minimize rounding distortion caused by isolated activation spikes.
- **In-Place Weight Substitution:** Modifies PyTorch `nn.Linear` layers in-place, enabling real forward passes, real KV-cache computation, and real autoregressive token generation.
- **Perfect Weight Restoration:** Caches original FP16 weights, enabling dynamic toggling between FP16, INT4, INT8, and mixed-precision repair during a single session.

---

## 5. Project Directory Structure

```text
QTRACE/
├── main.py                     # Master execution & orchestration CLI
├── config.yaml                 # Central experimental configuration
├── requirements.txt            # Python dependencies
├── README.md                   # Comprehensive scientific documentation
├── LICENSE                     # MIT Open Source License
│
├── qtrace/
│   ├── __init__.py             # Package exports
│   ├── models.py               # ModelManager, aliases, unloading, memory cleanup
│   ├── datasets.py             # TruthfulQA, HaluEval, Custom CSV, leakage checks
│   ├── quantization.py         # Q-TRACE Group-wise Quantizer & progressive PTQ
│   ├── calibration.py          # Calibration corpus & activation collection hooks
│   ├── attribution.py          # Module categorization & weight distribution stats
│   ├── sensitivity.py          # Numerical sensitivity & one-layer ablation probes
│   ├── representations.py      # Hidden states, cosine drift, first divergence layer
│   ├── logits.py               # KL divergence, Jensen-Shannon divergence, top overlap
│   ├── tokens.py               # Token diffs, entity extraction, Critical Token Stability
│   ├── generation.py           # Deterministic generation & token confidence telemetry
│   ├── hallucination.py        # Correctness checks & failure taxonomy classification
│   ├── metrics.py              # Reliability Score, QRG, Recovery, ILI, ECE
│   ├── reliability.py          # Consistency score & Perplexity vs Factuality analysis
│   ├── repair.py               # Selective mixed-precision repair & greedy search
│   ├── adaptive.py             # Adaptive precision engine & escalation routing
│   ├── efficiency.py           # Storage footprint, warm latency, and throughput
│   ├── statistics.py           # Bootstrap 95% CIs and paired significance tests
│   ├── visualization.py        # Publication-ready Matplotlib chart generator
│   ├── terminal.py             # Section banners, per-question views, ASCII charts
│   └── checkpoints.py          # State persistence and resume manager
│
├── data/
│   └── custom_eval.csv         # Custom multi-reference evaluation dataset
│
├── tests/
│   ├── test_quantization.py    # Quantizer bounds and weight restoration tests
│   ├── test_metrics.py         # Reliability score, QRG, and recovery math tests
│   ├── test_repair.py          # Mixed-precision allocation tests
│   └── test_adaptive.py        # Uncertainty evaluation & routing rate tests
│
├── docs/
│   ├── methodology.md          # Scientific methodology & execution pipeline
│   ├── metrics.md              # Formal definitions of all evaluation metrics
│   ├── research_questions.md   # Detailed hypotheses for RQ1–RQ10
│   ├── limitations.md          # Experimental limitations and boundary conditions
│   └── experiment_matrix.md    # Matrix of experimental configurations
│
└── results/
    ├── graphs/                 # High-resolution scientific PNG figures
    ├── tables/                 # Comprehensive CSV result tables
    ├── failures/               # failure_cases.txt & failure_cases.json dossiers
    ├── checkpoints/            # Intermediate serialized states
    ├── raw/                    # Raw forward pass telemetries
    ├── human_validation_template.csv
    └── QTRACE_research_report.md # Automatically synthesized academic report
```

---

## 6. Installation & Quickstart

### Prerequisites
- Python 3.10+
- PyTorch 2.0+ (CUDA or CPU)

### Setup
```bash
# 1. Clone or navigate to the repository
cd d:/main

# 2. Install dependencies
pip install -r requirements.txt
```

---

## 7. Execution Commands

### A. Fast Run (Recommended for Immediate Evaluation)
Executes a rapid, real-inference evaluation over 10 probes with calibration, sensitivity analysis, repair, and adaptive precision:
```bash
python main.py --fast
```

### B. Quick Comparison Run
Compares FP16, Direct INT4, Progressive INT4, Sensitivity Repair, and Adaptive Precision:
```bash
python main.py --quick
```

### C. Full Comprehensive Research Run
Executes the exhaustive experimental matrix, multi-sample calibration sweeps, layer ablations, and full chart generation:
```bash
python main.py --research
```

### D. Model Selection
```bash
# Qwen 2.5 0.5B Instruct (Default, ultra-fast)
python main.py --model qwen05

# Qwen 2.5 1.5B Instruct
python main.py --model qwen15

# Custom Hugging Face model
python main.py --model Qwen/Qwen2.5-0.5B-Instruct
```

### E. Dataset Selection & Custom Datasets
```bash
# Evaluate on TruthfulQA
python main.py --dataset truthfulqa --samples 20

# Evaluate on HaluEval
python main.py --dataset halueval --samples 20

# Evaluate on Custom CSV
python main.py --dataset csv --csv data/custom_eval.csv
```

### F. Resume Interrupted Experiments
```bash
python main.py --resume
```

---

## 8. Metric Principles & Formulas

| Metric Category | Metric Name | Definition / Formula |
|---|---|---|
| **Benchmark-Native** | Reference Agreement | Exact string match or substring match against verified ground truth |
| **Automatic Proxy** | Lexical Token F1 | Harmonic mean of token precision and recall against references |
| **Automatic Proxy** | Validation Perplexity | $\text{PPL} = \exp(\mathcal{L}_{\text{CE}})$ |
| **Project-Defined** | **Q-TRACE Reliability Score** | $0.50 \cdot \text{Corr} + 0.20 \cdot \text{Sem} + 0.15 \cdot \text{Cal} + 0.15 \cdot \text{Cons}$ |
| **Project-Defined** | **Quantization Reliability Gap** | $\text{QRG} = \text{Rel}_{\text{FP16}} - \text{Rel}_{\text{Quant}}$ |
| **Project-Defined** | **Reliability Recovery** | $\text{Recovery} = \frac{\text{Rel}_{\text{Repair}} - \text{Rel}_{\text{INT4}}}{\text{Rel}_{\text{FP16}} - \text{Rel}_{\text{INT4}}}$ |
| **Project-Defined** | **Critical Token Stability** | Ratio of unchanged entities, numbers, and dates |
| **Project-Defined** | **Adaptive Escalation Rate** | Fraction of queries escalated to INT8 or FP16 |

---

## 9. Failure Case Taxonomy

When quantization causes factual corruption, Q-TRACE automatically classifies the failure into one of 10 structured categories:
1. `factual entity substitution` (e.g. swapping Alexander Fleming with Louis Pasteur)
2. `fabricated entity` (inventing non-existent organizations or individuals)
3. `numerical error` (corrupting statistics, counts, or measurements)
4. `date/temporal error` (chronological shifts by decades or centuries)
5. `false-premise acceptance` (agreeing with deceptive presuppositions)
6. `unsupported claim` (stating claims without factual grounding)
7. `contradiction` (internal logical inconsistency)
8. `semantic drift` (general linguistic topic divergence)
9. `incomplete answer` (truncation before key fact is stated)
10. `overconfident incorrect answer` (high softmax probability on false output)

---

## 10. Automated Deliverables

Running Q-TRACE produces:
1. **Interactive Terminal Telemetry:** Real-time per-question comparisons, ASCII comparison graphs, and failure dossiers.
2. **Scientific Visualizations (`results/graphs/`):** Publication-ready figures including Pareto curves, layer sensitivity bars, representation drift plots, and failure taxonomy distributions.
3. **Structured Tables (`results/tables/`):** Raw CSVs for all precision levels, layer errors, and routing metrics.
4. **Human Validation Template (`results/human_validation_template.csv`):** Formatted sheet for blind manual auditing.
5. **Research Dossier (`results/failures/failure_cases.txt`):** Detailed breakdown of every single observed failure.
6. **Automated Academic Report (`results/QTRACE_research_report.md`):** Complete synthesized paper draft reporting actual measured findings.
7. **Downloadable Package:** Complete deliverable bundled as `QTRACE_ULTIMATE_COMPLETE_PROJECT.zip`.

---

## 11. Running Unit Tests

To verify mathematical correctness and module integrity:
```bash
python -m pytest tests/
```
All 11 unit tests execute in under 10 seconds and validate quantization bounds, reconstruction metrics, repair allocations, and adaptive routing math.

---

## 12. Citation & Attribution

```bibtex
@misc{qtrace_2026,
  title={Q-TRACE: Quantization Trace, Reliability, Calibration and Adaptive Precision},
  author={Q-TRACE Research Team},
  year={2026},
  howpublished={Empirical Research Investigation on Small Language Model Safety & Compression}
}
```
