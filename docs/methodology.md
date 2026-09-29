# Q-TRACE Scientific Methodology

## 1. Overview
Q-TRACE investigates the chain of causality:
$$\text{Weight Discretization Noise} \longrightarrow \text{Layer-Wise Representation Drift} \longrightarrow \text{Logit Probability Shift} \longrightarrow \text{Factual Hallucination}$$

## 2. Quantization Engine
The system employs the transparent **Q-TRACE Group-wise Quantizer**:
- Symmetric linear integer quantization across configurable group sizes (32, 64, 128, 256).
- Scaling factor: $s = \frac{\max(|W|)}{2^{b-1}-1}$.
- Integer rounding with optional percentile clipping ($p=99.5\%$) to bound outlier noise.
- Weights are mapped and replaced in-place in PyTorch `nn.Linear` layers, ensuring that real forward passes, KV-caches, and token generation reflect actual numerical degradation.

## 3. Propagation Diagnostics
- **Weight Level:** Absolute error, RMSE, relative Frobenius error, and outlier ratio ($>3\sigma$).
- **Representation Level:** Cosine similarity and distance across all decoder layer outputs. Isolation of the **First Observed Divergence Layer**.
- **Logit Level:** Full vocabulary Kullback-Leibler (KL) and Jensen-Shannon (JS) divergence, top-1 token changes, top-5 and top-10 Jaccard overlap.
- **Token Level:** Diff extraction tracking critical entity substitutions, chronological confabulations, and numerical drift.

## 4. Mitigation & Recovery Strategies
- **Quantization Repair:** Automatic identification of high-sensitivity modules followed by selective restoration to INT8 or FP16.
- **Adaptive Precision Routing:** Dynamic three-tier triage (INT4 $\rightarrow$ INT8 $\rightarrow$ FP16) based on inference entropy and confidence margins.
