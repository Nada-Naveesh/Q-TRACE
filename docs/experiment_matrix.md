# Q-TRACE Experiment Matrix

| Experiment ID | Focus Area | Precision Levels | Diagnostic Targets | Deliverables |
|---|---|---|---|---|
| EXP-01 | Baseline Quantization | FP16, INT8, Direct INT4, Progressive INT4 | Accuracy, Perplexity, Memory, Latency | Precision Reliability Curves |
| EXP-02 | Granularity & Group Size | Group 32, 64, 128, 256, Per-Channel | Reconstruction RMSE, Relative Error | Group Size Scaling Analysis |
| EXP-03 | Calibration Sensitivity | 16, 32, 64, 128 samples (QA vs General) | Outlier Protection, Activation Scale | Calibration Size & Domain Curves |
| EXP-04 | Layer Saliency & Ablation | Single-layer INT4 Ablations | Logit KL Divergence, Top-1 Change | Top Sensitive Modules Ranking |
| EXP-05 | Representation Drift | FP16 vs INT4 Hidden States | Cosine Distance across Layers | First Observed Divergence Layer |
| EXP-06 | Token & Entity Drift | Generation Outputs | Critical Token Stability, Entity Swaps | Failure Taxonomy Dossier |
| EXP-07 | Quantization Repair | INT4 + Top 5%, 10%, 15%, 20% in INT8 | Reliability Recovery %, Memory Overhead | Repair Search Curve |
| EXP-08 | Adaptive Precision | INT4 -> INT8 -> FP16 Uncertainty Triage | Escalation Rate, Latency, Accuracy | Adaptive Precision Distribution |
| EXP-09 | Pareto Trade-off | All Evaluated Configurations | Reliability Score vs Memory Savings | Pareto Frontier Plot |
