'use client';

import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Layers, 
  Cpu, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  Flame, 
  Database, 
  Activity,
  Microchip,
  GitBranch,
  ShieldCheck,
  TrendingDown
} from 'lucide-react';
import { RESEARCH_METADATA } from '@/data/researchData';

interface HeroSectionProps {
  onExploreSimulator: () => void;
  onViewArchitecture: () => void;
  onReadAbstract: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreSimulator,
  onViewArchitecture,
  onReadAbstract,
}) => {
  return (
    <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden">
      {/* Background Glow Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-gradient-to-tr from-cyan-500/15 via-indigo-500/15 to-transparent blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-[90px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/60 text-cyan-300 text-xs font-mono tracking-wide">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>AI/NLP Research Proposal</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/60 border border-slate-700/60 text-slate-300 text-xs font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span>Model Compression &amp; AI Safety</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/40 border border-slate-700/40 text-slate-400 text-xs">
            <GitBranch className="w-3 h-3 text-slate-500" />
            <span>Colab T4 Verified</span>
          </div>
        </div>

        {/* Title */}
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
            Evaluating{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
              Quantization-Induced
            </span>{' '}
            Factual Hallucinations in Lightweight{' '}
            <span className="inline-block relative">
              <span className="bg-gradient-to-r from-indigo-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
                Small Language Models
              </span>
              <span className="text-slate-500 text-xs sm:text-sm font-mono absolute -top-3 -right-10 bg-slate-800/90 px-1.5 py-0.5 rounded border border-slate-700">
                (SLMs)
              </span>
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg md:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
            Quantizing sub-2B parameter models to 4-bit cuts VRAM by 67% and quadruples edge inference speed—yet triggers an alarming <strong className="text-cyan-300 font-semibold">+28% to +41% spike in factual hallucination</strong> that standard perplexity benchmarks fail to detect.
          </p>

          {/* Primary Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <button
              onClick={onExploreSimulator}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-semibold text-sm sm:text-base flex items-center gap-2 shadow-lg shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Cpu className="w-4 h-4" />
              <span>Try Interactive Simulator</span>
              <ArrowRight className="w-4 h-4 ml-0.5" />
            </button>

            <button
              onClick={onViewArchitecture}
              className="px-5 py-3 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 text-slate-200 font-medium text-sm sm:text-base border border-slate-700/80 hover:border-slate-600 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>View Architecture</span>
            </button>

            <button
              onClick={onReadAbstract}
              className="px-5 py-3 rounded-xl bg-slate-900/40 hover:bg-slate-800/50 text-slate-300 font-medium text-sm sm:text-base border border-slate-800 hover:border-slate-700 flex items-center gap-2 transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4 text-indigo-400" />
              <span>Read Abstract</span>
            </button>
          </div>

          {/* Authors & Institutional Metadata */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-400 font-medium">
            <span className="text-slate-300 font-semibold">{RESEARCH_METADATA.lab}</span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span>{RESEARCH_METADATA.institution}</span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span className="text-cyan-400/90 font-mono">NeurIPS / ICLR Workshop Track Target</span>
          </div>
        </div>

        {/* Key Impact Metrics Cards Grid */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 max-w-5xl mx-auto">
          {/* Card 1: Models Tested */}
          <div className="glass-panel rounded-2xl p-5 relative overflow-hidden group hover:border-cyan-500/40 transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/10 transition-colors" />
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase font-mono tracking-wider text-slate-400 font-medium">
                Target Models Tested
              </span>
              <div className="p-2 rounded-lg bg-cyan-950/50 border border-cyan-800/40 text-cyan-400">
                <Microchip className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Llama 3.2 1B &amp; Qwen 2.5 1.5B
            </div>
            <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
              Sub-2B parameter lightweight models designed for on-device and edge agent deployments.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-400">SmolLM2 1.7B Control</span>
              <span className="text-cyan-400">Dense Autoregressive</span>
            </div>
          </div>

          {/* Card 2: Precision Levels */}
          <div className="glass-panel rounded-2xl p-5 relative overflow-hidden group hover:border-indigo-500/40 transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-colors" />
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase font-mono tracking-wider text-slate-400 font-medium">
                Precision Levels
              </span>
              <div className="p-2 rounded-lg bg-indigo-950/50 border border-indigo-800/40 text-indigo-400">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              FP16, INT8, INT4 AWQ/GPTQ
            </div>
            <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
              From uncompressed half-precision to second-order Hessian &amp; activation-aware 4-bit compression.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-400">Bit-Width Spectrum</span>
              <span className="text-indigo-400">16-bit → 4-bit PTQ</span>
            </div>
          </div>

          {/* Card 3: Benchmarks */}
          <div className="glass-panel rounded-2xl p-5 relative overflow-hidden group hover:border-emerald-500/40 transition-all sm:col-span-2 lg:col-span-1">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors" />
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase font-mono tracking-wider text-slate-400 font-medium">
                Factual Benchmarks
              </span>
              <div className="p-2 rounded-lg bg-emerald-950/50 border border-emerald-800/40 text-emerald-400">
                <Database className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              TruthfulQA &amp; HaluEval
            </div>
            <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
              817 multi-category adversarial factual probes + 35,000 hallucination samples via vLLM batching.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-400">Google Colab T4 (16GB)</span>
              <span className="text-emerald-400">35k+ Audited Tokens</span>
            </div>
          </div>
        </div>

        {/* Warning Callout Bar: The Core Research Finding */}
        <div className="mt-6 max-w-5xl mx-auto rounded-xl bg-amber-950/20 border border-amber-500/30 p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 shrink-0">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className="flex-1 text-xs sm:text-sm text-slate-300">
            <span className="font-semibold text-amber-300">The Perplexity Paradox Warning:</span>{' '}
            A model's test perplexity may change by merely <strong className="text-white">+0.67 points</strong> after INT4 AWQ quantization, yet its factual hallucination rate skyrockets by <strong className="text-amber-400">+18.4% to +30.1%</strong>, causing catastrophic entity and chronological fabrications.
          </div>
          <button
            onClick={onExploreSimulator}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 shrink-0 cursor-pointer"
          >
            <span>Inspect in Simulator</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
};
