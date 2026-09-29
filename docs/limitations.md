# Q-TRACE Scientific Limitations & Scope

1. **Model Parameter Scope:** The current investigation primarily focuses on sub-2B parameter language models (Qwen2.5-0.5B and Qwen2.5-1.5B). While these represent practical edge deployment candidates, findings regarding parameter utilization density may vary in 70B+ architectures with massive redundancy.
2. **Evaluation Sample Size in Fast Mode:** In `--fast` mode, sample counts are constrained (e.g. 10 probes) for rapid execution. For formal statistical significance and publication-grade hypothesis tests, users must execute `--research` mode.
3. **Lexical Proxy vs Human Ground Truth:** While multi-reference ground truths and exact matching provide reliable evaluation, subtle semantic nuances in open-ended generations may benefit from secondary human validation (using the generated `results/human_validation_template.csv`).
4. **Quantizer Kernel Efficiency:** The Q-TRACE Group-wise Quantizer executes simulated dequantization forward passes in PyTorch to enable granular layer inspection. For production edge deployment, dedicated C++/CUDA kernels (such as AutoAWQ GEMM or Marlin) should be compiled.
