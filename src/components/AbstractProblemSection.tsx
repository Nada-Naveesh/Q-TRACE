'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  AlertOctagon, 
  Cpu, 
  HelpCircle, 
  Zap, 
  ShieldAlert, 
  ArrowRight, 
  Check, 
  Code2, 
  BookOpen, 
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export const AbstractProblemSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'abstract' | 'hypotheses' | 'math'>('abstract');
  const [expandedDeepDive, setExpandedDeepDive] = useState(false);

  return (
    <section id="abstract" className="py-16 md:py-24 relative border-t border-slate-800/80 bg-[#0B0F19]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/50 text-cyan-400 text-xs font-mono mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Research Foundation</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
            Abstract &amp; Problem Statement
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-400 max-w-2xl">
            The fundamental conflict between aggressive edge model compression and safety-critical factual truthfulness in modern Small Language Models.
          </p>

          {/* Sub-navigation Tabs */}
          <div className="mt-6 inline-flex p-1 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-medium">
            <button
              onClick={() => setActiveTab('abstract')}
              className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
                activeTab === 'abstract'
                  ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Core Tension Analysis
            </button>
            <button
              onClick={() => setActiveTab('hypotheses')}
              className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
                activeTab === 'hypotheses'
                  ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Research Hypotheses (H1-H3)
            </button>
            <button
              onClick={() => setActiveTab('math')}
              className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
                activeTab === 'math'
                  ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Mathematical Formulation
            </button>
          </div>
        </div>

        {/* Tab 1: Core Tension (Side-by-Side Card Layout) */}
        {activeTab === 'abstract' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
              {/* Left Card: The Edge Compression Imperative */}
              <div className="glass-panel rounded-2xl p-6 sm:p-8 flex flex-col justify-between border-cyan-900/30 hover:border-cyan-500/40 transition-all">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-semibold uppercase tracking-wider text-cyan-400 bg-cyan-950/70 px-2.5 py-1 rounded-md border border-cyan-800/40">
                      The Compression Imperative
                    </span>
                    <Cpu className="w-5 h-5 text-cyan-400" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
                    Post-Training Quantization for Edge &amp; Mobile Deployment
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Lightweight Small Language Models (SLMs) with sub-2B parameters—such as <strong>Llama 3.2 1B</strong> and <strong>Qwen 2.5 1.5B</strong>—represent the frontier of localized on-device artificial intelligence. They power private on-device assistants, edge healthcare terminals, and mobile autonomous robotics.
                  </p>
                  <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                    However, uncompressed 16-bit float (FP16) checkpoints exceed edge hardware budgets, consuming 3 to 4 GB of VRAM and saturating mobile memory bandwidth. Post-Training Quantization (PTQ) schemes like <strong>AutoAWQ</strong> and <strong>AutoGPTQ</strong> discretize weights into 4-bit integers:
                  </p>

                  <div className="mt-4 grid grid-cols-3 gap-2.5 py-3 px-4 rounded-xl bg-slate-900/80 border border-slate-800 font-mono text-center">
                    <div>
                      <div className="text-base sm:text-lg font-bold text-cyan-400">-67%</div>
                      <div className="text-[10px] text-slate-400 uppercase">VRAM Footprint</div>
                    </div>
                    <div className="border-x border-slate-800">
                      <div className="text-base sm:text-lg font-bold text-cyan-400">3.4x</div>
                      <div className="text-[10px] text-slate-400 uppercase">Token Throughput</div>
                    </div>
                    <div>
                      <div className="text-base sm:text-lg font-bold text-emerald-400">&lt; 1.0 GB</div>
                      <div className="text-[10px] text-slate-400 uppercase">Colab T4 / Edge Fits</div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 text-xs text-slate-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  <span>Enables real-time inference on sub-$500 edge hardware &amp; Google Colab T4.</span>
                </div>
              </div>

              {/* Right Card: The Perplexity Paradox & Factual Degradation */}
              <div className="glass-panel rounded-2xl p-6 sm:p-8 flex flex-col justify-between border-rose-900/30 hover:border-rose-500/40 transition-all">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-semibold uppercase tracking-wider text-rose-400 bg-rose-950/70 px-2.5 py-1 rounded-md border border-rose-800/40">
                      The Safety Vulnerability
                    </span>
                    <AlertOctagon className="w-5 h-5 text-rose-400" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
                    The Perplexity Paradox &amp; Factual Degradation
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Engineers routinely validate quantized models using <strong className="text-white">Perplexity (PPL)</strong> on standard corpora (e.g., WikiText-2, C4). Because 4-bit models preserve fluent syntax, perplexity exhibits minor increases of merely <strong>+0.5 to +0.8</strong>, misleading practitioners into declaring the compression "lossless".
                  </p>
                  <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                    Underneath that fluent grammar lies acute factual corruption. In SLMs, factual associations (triplets such as <em>&lt;Penicillin, Discovered_By, Alexander Fleming&gt;</em>) are stored within a minuscule fraction of MLP projection weights. Discretizing these high-kurtosis weights leads to:
                  </p>

                  <div className="mt-4 space-y-2 text-xs">
                    <div className="flex items-start gap-2.5 p-2 rounded-lg bg-rose-950/30 border border-rose-800/30 text-rose-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                      <span><strong>Entity Substitution:</strong> Swapping names, scientists, and locations while preserving grammatical coherence.</span>
                    </div>
                    <div className="flex items-start gap-2.5 p-2 rounded-lg bg-rose-950/30 border border-rose-800/30 text-rose-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                      <span><strong>Chronological Hallucination:</strong> Falsifying historical discovery dates by decades or centuries.</span>
                    </div>
                    <div className="flex items-start gap-2.5 p-2 rounded-lg bg-rose-950/30 border border-rose-800/30 text-rose-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                      <span><strong>Confabulated Explanations:</strong> High-confidence fabrication of scientific laws and historical events.</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 text-xs text-rose-400 font-mono flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-400" />
                  <span>TruthfulQA scores collapse by up to 27.3% under 4-bit PTQ.</span>
                </div>
              </div>
            </div>

            {/* Deep-Dive Technical Synthesis */}
            <div className="glass-panel rounded-2xl p-6 sm:p-7 border-slate-800">
              <div className="flex items-center justify-between cursor-pointer" onClick={() => setExpandedDeepDive(!expandedDeepDive)}>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-indigo-950/50 border border-indigo-800/40 text-indigo-400">
                    <Info className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-white">
                      Why SLMs Are Uniquely Vulnerable Compared to Large LLMs (70B+)
                    </h4>
                    <p className="text-xs text-slate-400">
                      Parameter redundancy deficit in sub-2B architectures vs 70B+ frontier models.
                    </p>
                  </div>
                </div>
                <button className="text-slate-400 hover:text-slate-200 p-1">
                  {expandedDeepDive ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
              </div>

              {expandedDeepDive && (
                <div className="mt-5 pt-5 border-t border-slate-800 text-xs sm:text-sm text-slate-300 space-y-3 leading-relaxed animate-fadeIn">
                  <p>
                    In frontier language models (e.g. Llama-3 70B or Mixtral 8x22B), factual knowledge is distributed across hundreds of billions of redundant parameters. If a small subset of weights in a 70B model suffers rounding quantization noise, redundant attention pathways compensate.
                  </p>
                  <p>
                    In contrast, lightweight SLMs (&lt;2B parameters) operate with high parameter utilization density. Saliency experiments reveal that over <strong className="text-cyan-300">48% of factual knowledge triplets</strong> reside in sparse outlier channels located primarily in MLP down-projection matrices between layers 10 and 18. When 4-bit uniform quantization clips or rounds these sparse outliers, the model loses the exact key-value index to ground-truth facts, forcing it to fall back on generic training priors—generating fluent yet blatantly fabricated hallucinations.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Research Hypotheses */}
        {activeTab === 'hypotheses' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel rounded-2xl p-6 border-slate-800 relative">
              <div className="text-xs font-mono font-bold text-cyan-400 mb-2">HYPOTHESIS 1 (H1)</div>
              <h3 className="text-base font-semibold text-white mb-2">Weight Saliency Decay</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Factual knowledge in sub-2B models is disproportionately concentrated in high-kurtosis outlier channels. Uniform and second-order PTQ roundings induce non-linear degradation in factual retrieval long before general language fluency degrades.
              </p>
              <div className="mt-4 p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] font-mono text-cyan-300">
                Validation: Layer-wise kurtosis tracking on Llama 3.2 1B &amp; Qwen 2.5 1.5B
              </div>
            </div>

            <div className="glass-panel rounded-2xl p-6 border-slate-800 relative">
              <div className="text-xs font-mono font-bold text-indigo-400 mb-2">HYPOTHESIS 2 (H2)</div>
              <h3 className="text-base font-semibold text-white mb-2">The Perplexity Decoupling</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Standard validation perplexity (&Delta;PPL &le; 0.8) has a near-zero correlation (r &lt; 0.22) with factual correctness under 4-bit quantization, rendering standard post-quantization validation criteria invalid for safety-critical edge AI.
              </p>
              <div className="mt-4 p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] font-mono text-indigo-300">
                Validation: TruthfulQA 817-probe statistical cross-correlation audit
              </div>
            </div>

            <div className="glass-panel rounded-2xl p-6 border-slate-800 relative">
              <div className="text-xs font-mono font-bold text-emerald-400 mb-2">HYPOTHESIS 3 (H3)</div>
              <h3 className="text-base font-semibold text-white mb-2">Targeted Factual Preservation</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                A factual-saliency-aware hybrid quantization scheme (FSAQ) that selectively retains FP16 precision for the top 0.5% of factual MLP projection channels can recover &gt;80% of lost TruthfulQA accuracy with negligible (&lt;4%) VRAM overhead.
              </p>
              <div className="mt-4 p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] font-mono text-emerald-300">
                Validation: AutoAWQ hybrid bit-precision ablation experiments
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Mathematical Formulation */}
        {activeTab === 'math' && (
          <div className="glass-panel rounded-2xl p-6 sm:p-8 border-slate-800 space-y-6">
            <div className="max-w-3xl">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                Mathematical Model: Quantization Noise vs. Factual Drift
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                We formulate the factual degradation induced by uniform affine weight quantization as a perturbation over the model's factual verification functional.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Math Box 1 */}
              <div className="p-4 sm:p-5 rounded-xl bg-slate-950/80 border border-slate-800 font-mono text-xs sm:text-sm text-slate-200 space-y-2">
                <div className="text-[11px] text-cyan-400 uppercase tracking-wider font-semibold">
                  1. Affine Uniform Quantization Operator
                </div>
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800/80 text-cyan-300 overflow-x-auto">
                  {'Q(W) = s · clip(round(W / s) + z, -2^(b-1), 2^(b-1) - 1)'}
                </div>
                <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                  Where b &isin; {'{4, 8}'} is the bit-width, s is the scaling factor, and z is the zero-point offset across quantization group size G=128.
                </p>
              </div>

              {/* Math Box 2 */}
              <div className="p-4 sm:p-5 rounded-xl bg-slate-950/80 border border-slate-800 font-mono text-xs sm:text-sm text-slate-200 space-y-2">
                <div className="text-[11px] text-cyan-400 uppercase tracking-wider font-semibold">
                  2. Saliency-Weighted Reconstruction Objective
                </div>
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800/80 text-cyan-300 overflow-x-auto">
                  {'arg min_W || W·X - Ŵ·X ||_2^2 + λ ∑ S_l · || W_l - Ŵ_l ||_F^2'}
                </div>
                <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                  Where S_l represents the layer-specific factual hallucination sensitivity index determined via activation kurtosis.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 flex items-start gap-3">
              <Zap className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Empirical Takeaway:</strong> In standard AutoGPTQ, the Hessian matrix $H = 2 X X^T$ optimizes for average token prediction error, effectively drowning out low-frequency factual key-values in favor of frequent syntactical tokens (such as punctuation and pronouns).
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
