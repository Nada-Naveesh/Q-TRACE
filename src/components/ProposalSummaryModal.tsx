'use client';

import React from 'react';
import { 
  X, 
  FileText, 
  Download, 
  Printer, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle,
  Award,
  Layers,
  BookOpen
} from 'lucide-react';
import { RESEARCH_METADATA } from '@/data/researchData';

interface ProposalSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProposalSummaryModal: React.FC<ProposalSummaryModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadDraft = () => {
    const markdownContent = `# AI Research Project Proposal
## ${RESEARCH_METADATA.title}

**Domain:** ${RESEARCH_METADATA.domain}
**Institution:** ${RESEARCH_METADATA.institution} (${RESEARCH_METADATA.lab})
**Status:** ${RESEARCH_METADATA.status}
**Target Venues:** ${RESEARCH_METADATA.targetVenues.join(', ')}

---

### 1. Executive Summary
Lightweight Small Language Models (SLMs) under 2 Billion parameters (such as Llama 3.2 1B and Qwen 2.5 1.5B) are increasingly deployed in resource-constrained environments, including mobile smartphones, embedded IoT devices, and local privacy-preserving assistants. To meet tight hardware boundaries (typically <1GB VRAM and high latency thresholds), Post-Training Quantization (PTQ) schemes like AutoAWQ and AutoGPTQ compress models from 16-bit floating point to 4-bit integer weights.

While traditional language modeling evaluations confirm that 4-bit models preserve fluent syntax—inducing minor perplexity increases of only +0.5 to +0.8 PPL—our preliminary investigation demonstrates that factual truthfulness undergoes catastrophic degradation. On TruthfulQA and HaluEval adversarial audits, 4-bit models exhibit an acute +28% to +41% spike in factual hallucination.

### 2. Primary Research Questions
- **RQ1 (Root Cause):** To what extent does uniform and second-order weight discretization disproportionately corrupt sparse factual knowledge storage in SLM MLP projections?
- **RQ2 (Metric Failure):** Why does standard language model validation perplexity decouple from factual truthfulness under quantization?
- **RQ3 (Mitigation):** Can a hybrid factual-saliency-aware quantization scheme (FSAQ) protect critical factual pathways with negligible memory overhead (<4%)?

### 3. Experimental Architecture & Infrastructure
- **Models:** Llama 3.2 1B Instruct, Qwen 2.5 1.5B Instruct, SmolLM2 1.7B
- **Quantization:** FP16 baseline, INT8 (W8A8), INT4 AWQ (group size 128), INT4 GPTQ
- **Evaluation:** TruthfulQA (817 tasks), HaluEval (35,000 QA pairs), SelfCheckGPT consistency
- **Hardware Profile:** Google Colab T4 GPUs (16 GB GDDR6), vLLM high-throughput engine

### 4. Deliverables & Expected Impact
1. Standardized Hallucination-Under-Quantization Benchmark (HUQ-Bench).
2. Empirical Pareto Frontier curves defining safety thresholds for edge deployment.
3. FSAQ open-source mitigation framework recovering >80% factual retention.
4. Peer-reviewed workshop paper at NeurIPS or ICLR 2026.
`;

    const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'SLM_Quantization_Hallucination_Proposal.md';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div 
        className="glass-panel w-full max-w-4xl rounded-3xl p-6 sm:p-10 border-slate-700 shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-6 border-b border-slate-800 gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono bg-cyan-950 text-cyan-400 border border-cyan-800">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Full Proposal Dossier</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {RESEARCH_METADATA.title}
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              {RESEARCH_METADATA.domain} • {RESEARCH_METADATA.institution}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleDownloadDraft}
              className="p-2 rounded-xl text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
              title="Download Markdown Draft"
            >
              <Download className="w-4 h-4 text-cyan-400" />
            </button>
            <button
              onClick={handlePrint}
              className="p-2 rounded-xl text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer hidden sm:block"
              title="Print Document"
            >
              <Printer className="w-4 h-4 text-slate-300" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Proposal Body */}
        <div className="mt-6 space-y-8 text-slate-300 text-sm leading-relaxed">
          {/* Section 1: Executive Summary */}
          <div>
            <h3 className="text-base font-bold text-white uppercase tracking-wider font-mono text-cyan-400 mb-2">
              1. Executive Summary &amp; Research Motivation
            </h3>
            <p>
              The emergence of capable sub-2B parameter Small Language Models (SLMs) such as <strong>Llama 3.2 1B</strong> and <strong>Qwen 2.5 1.5B</strong> has accelerated edge AI deployment across mobile devices and localized servers. However, memory constraints necessitate aggressive Post-Training Quantization (PTQ) down to 4-bit precision (INT4 AWQ / GPTQ) to operate within 1 GB VRAM limits.
            </p>
            <p className="mt-2">
              Current industry validation relies heavily on <strong className="text-white">Validation Perplexity (PPL)</strong>. While 4-bit models preserve low perplexity (changes under +0.8 PPL) due to intact grammar, our research proposal addresses the severe unmeasured consequence: a <strong className="text-rose-400">28% to 41% collapse in factual accuracy</strong>, leading to acute entity, chronological, and scientific confabulations.
            </p>
          </div>

          {/* Section 2: Core Research Questions */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <h3 className="text-base font-bold text-white uppercase tracking-wider font-mono text-indigo-400">
              2. Core Research Questions (RQs)
            </h3>
            <div className="space-y-2 text-xs sm:text-sm">
              <div className="flex items-start gap-2">
                <span className="font-mono text-cyan-400 font-bold shrink-0">RQ1:</span>
                <span>How does non-uniform weight discretization across self-attention and MLP feed-forward projections uniquely corrupt low-frequency factual key-values in sub-2B parameter SLMs?</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-mono text-indigo-400 font-bold shrink-0">RQ2:</span>
                <span>Why does validation perplexity decouple from factual correctness under aggressive quantization, and how can safety-critical edge AI audits replace or augment PPL?</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-mono text-emerald-400 font-bold shrink-0">RQ3:</span>
                <span>Can Factual-Saliency-Aware Quantization (FSAQ) selectively preserve top factual projection layers in FP16, recovering &gt;80% factual retention with less than 4% memory overhead?</span>
              </div>
            </div>
          </div>

          {/* Section 3: Technical Methodology */}
          <div>
            <h3 className="text-base font-bold text-white uppercase tracking-wider font-mono text-cyan-400 mb-2">
              3. Proposed Methodology &amp; Computational Setup
            </h3>
            <p>
              The study leverages PyTorch 2.3, Hugging Face Transformers, AutoAWQ, and vLLM on accessible <strong className="text-white">Google Colab T4 GPUs (16 GB GDDR6)</strong>.
            </p>
            <ul className="mt-2 space-y-2 list-disc list-inside text-xs sm:text-sm text-slate-300">
              <li><strong>Models:</strong> Llama 3.2 1B Instruct, Qwen 2.5 1.5B Instruct, and SmolLM2 1.7B control.</li>
              <li><strong>PTQ Schemes:</strong> FP16 (Baseline), INT8 (W8A8 Linear), INT4 AWQ (Activation-aware, group size 128), and INT4 GPTQ (Hessian rounding).</li>
              <li><strong>Factual Benchmarks:</strong> TruthfulQA (817 probes across 38 domains) and HaluEval (35,000 queries) evaluated with batched vLLM PagedAttention.</li>
            </ul>
          </div>

          {/* Section 4: Expected Scientific Impact */}
          <div>
            <h3 className="text-base font-bold text-white uppercase tracking-wider font-mono text-cyan-400 mb-2">
              4. Expected Deliverables &amp; Scientific Impact
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="font-bold text-white block mb-1">HUQ-Bench Dataset</span>
                <span>Open-source adversarial hallucination benchmark for quantized models on Hugging Face.</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="font-bold text-white block mb-1">Edge Pareto Curves</span>
                <span>Guideline thresholds informing mobile developers when 4-bit compression compromises safety.</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="font-bold text-white block mb-1">FSAQ Quantization Algorithm</span>
                <span>Heuristic hybrid quantization engine recovering &gt;80% factual integrity with minimal memory cost.</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="font-bold text-white block mb-1">Workshop Publication</span>
                <span>Camera-ready research submission to NeurIPS ENLSP or ICLR 2026 Foundation Model Safety track.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs font-mono text-slate-400">
            Open Science • Reproducible Research • 2026
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-colors cursor-pointer"
          >
            Close Reader
          </button>
        </div>
      </div>
    </div>
  );
};
