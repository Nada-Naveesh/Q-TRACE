# Q-TRACE Metric Principles & Mathematical Formulations

To ensure rigorous scientific integrity, Q-TRACE strictly differentiates between benchmark-native truth metrics, automatic proxy heuristics, and project-defined experimental indices.

---

## 1. Benchmark-Native Metrics
Metrics intrinsically defined by established NLP datasets:
- **TruthfulQA Reference Agreement:** Binary or continuous exact/lexical match against authoritative ground truth reference answers.
- **HaluEval QA Accuracy:** Correct rejection of false premises and adversarial hallucinations.

---

## 2. Automatic Proxy Metrics
Standard computational heuristics measuring linguistic similarity:
- **Lexical Overlap & Token F1:** Harmonic mean of precision and recall between generated and reference tokens.
- **Jaccard Token Overlap:** Intersection over union of vocabulary tokens.
- **Perplexity (PPL):** Exponential of cross-entropy loss over evaluation tokens.

---

## 3. Project-Defined Research Metrics

### A. Q-TRACE Reliability Score
A weighted composite reliability functional defined as:
$$\text{Reliability} = 0.50 \cdot C + 0.20 \cdot S + 0.15 \cdot K + 0.15 \cdot \Omega$$
Where:
- $C$: Factual Correctness Rate against verified references.
- $S$: Semantic Lexical Agreement.
- $K$: Confidence Calibration Accuracy ($1 - \text{ECE}$).
- $\Omega$: Multi-query Generation Consistency.

### B. Quantization Reliability Gap (QRG)
$$\text{QRG} = \text{Reliability}_{\text{FP16}} - \text{Reliability}_{\text{Quant}}$$
$$\text{Normalized QRG} = \frac{\text{QRG}}{\text{Reliability}_{\text{FP16}}}$$

### C. Reliability Recovery
Measures the proportion of the quantization reliability gap recovered by repair or adaptive mechanisms:
$$\text{Recovery} = \frac{\text{Reliability}_{\text{Repaired}} - \text{Reliability}_{\text{INT4}}}{\text{Reliability}_{\text{FP16}} - \text{Reliability}_{\text{INT4}}}$$

### D. Information Loss Index (ILI)
Composite numerical and representation divergence score:
$$\text{ILI} = 0.35 \cdot \bar{E}_{\text{weight}} + 0.25 \cdot \bar{D}_{\text{act}} + 0.25 \cdot \bar{D}_{\text{KL}} + 0.15 \cdot \bar{\Delta}_{\text{prob}}$$

### E. Critical Token Stability (CTS)
Fraction of ground-truth entities, dates, numbers, and technical terms preserved:
$$\text{CTS} = \frac{|\mathcal{T}_{\text{critical}}^{\text{quant}} \cap \mathcal{T}_{\text{critical}}^{\text{FP16}}|}{|\mathcal{T}_{\text{critical}}^{\text{FP16}}|}$$

### F. Adaptive Escalation Rate (AER)
$$\text{AER} = \frac{N_{\text{INT8}} + N_{\text{FP16}}}{N_{\text{total}}}$$
