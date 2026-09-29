# Q-TRACE: Research Questions & Investigation Framework

### RQ1: Direct Quantization Degradation
**Question:** Does direct FP16 → INT4 quantization degrade factual reliability in lightweight Small Language Models (SLMs), even when general syntactic perplexity remains low?
**Hypothesis:** Factual key-values in SLMs reside in high-kurtosis outlier channels; uniform rounding truncates these channels, inducing entity confabulations.

### RQ2: Quantization Pathways
**Question:** Does the quantization pathway (Direct FP16 → INT4 vs Progressive FP16 → INT8 → INT4) affect the final 4-bit factual behavior?
**Hypothesis:** Progressive intermediate rounding acts as an empirical regularization step that preserves directional weight orientation.

### RQ3: Module & Layer Saliency
**Question:** Which transformer submodules (Self-Attention Q/K/V/O projections vs MLP Gate/Up/Down projections) are most vulnerable to 4-bit quantization noise?
**Hypothesis:** MLP down-projection layers, which function as factual associative memories, exhibit disproportionately high sensitivity.

### RQ4: First Observed Divergence
**Question:** At which depth in the transformer architecture does internal representation divergence first become observable?
**Hypothesis:** Representation divergence emerges in middle-to-late transformer layers (layers 8–14 in 0.5B/1.5B architectures) before culminating in logit drift.

### RQ5: Representation to Behavioral Propagation
**Question:** How does numerical weight reconstruction loss propagate through intermediate hidden states and token probabilities into observable output hallucination?
**Hypothesis:** Numerical error amplifies non-linearly across attention heads, compressing the margin between true factual tokens and dominant training prior tokens.

### RQ6: Calibration Data Sensitivity
**Question:** Can activation-aware calibration data mitigate quantization-induced factual errors, and how does calibration corpus domain affect factual retention?
**Hypothesis:** Factual QA calibration scales protect outlier factual channels significantly better than generic open-domain text.

### RQ7: Selective Quantization Repair
**Question:** Can selective higher precision repair (restoring the top 5%–15% sensitive modules to INT8 or FP16) recover factual reliability while retaining INT4 efficiency?
**Hypothesis:** Upgrading less than 15% of linear modules recovers over 80% of lost factual reliability at negligible VRAM overhead.

### RQ8: Adaptive Precision Routing
**Question:** Can uncertainty-guided adaptive precision routing (INT4 → INT8 → FP16) preserve factual truthfulness while achieving near-INT4 average latency?
**Hypothesis:** Entropy and token margin signals can reliably flag high-risk generations, escalating only ambiguous queries to higher precision.

### RQ9: The Perplexity Paradox
**Question:** Does language model validation perplexity adequately reflect factual reliability degradation under aggressive quantization?
**Hypothesis:** Perplexity exhibits near-zero correlation with factual truthfulness, as grammatically fluent hallucinations maintain deceptively low cross-entropy loss.

### RQ10: Reliability-Efficiency Pareto Frontier
**Question:** What constitutes the optimal Pareto frontier balancing factual truthfulness and edge computational efficiency across quantization configurations?
**Hypothesis:** The Pareto frontier is populated by hybrid adaptive precision and sensitivity-repaired mixed-precision models, outperforming uniform INT4.
