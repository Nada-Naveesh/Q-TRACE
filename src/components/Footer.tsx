'use client';

import React from 'react';
import { ShieldCheck, Heart, GitBranch, ArrowUp, FileText, Database, Sparkles } from 'lucide-react';
import { RESEARCH_METADATA } from '@/data/researchData';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-slate-800/80 bg-[#070A12] text-slate-400 py-12 text-xs font-sans relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-slate-800/60">
          {/* Col 1: About */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-cyan-950/80 border border-cyan-800 flex items-center justify-center text-cyan-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="font-bold text-sm text-white">
                SLM Quantization &amp; Hallucination Research
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-md">
              An open-science empirical investigation dedicated to diagnosing, cataloging, and mitigating factual degradation in lightweight sub-2B parameter language models under aggressive post-training quantization.
            </p>
            <div className="text-[11px] font-mono text-slate-500">
              {RESEARCH_METADATA.lab} • {RESEARCH_METADATA.institution}
            </div>
          </div>

          {/* Col 2: Research Quick Links */}
          <div className="space-y-2.5">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-300 font-semibold block">
              Investigation Modules
            </span>
            <ul className="space-y-1.5 text-xs">
              <li>
                <a href="#abstract" className="hover:text-cyan-400 transition-colors">
                  Abstract &amp; The Perplexity Paradox
                </a>
              </li>
              <li>
                <a href="#simulator" className="hover:text-cyan-400 transition-colors">
                  Interactive Precision Simulator
                </a>
              </li>
              <li>
                <a href="#pipeline" className="hover:text-cyan-400 transition-colors">
                  4-Phase Methodology Pipeline
                </a>
              </li>
              <li>
                <a href="#benchmarks" className="hover:text-cyan-400 transition-colors">
                  Benchmark Matrix &amp; Pareto Curves
                </a>
              </li>
              <li>
                <a href="#roadmap" className="hover:text-cyan-400 transition-colors">
                  Roadmap &amp; Expected Deliverables
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Target Venues & Open Science */}
          <div className="space-y-2.5">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-300 font-semibold block">
              Open Science &amp; Venues
            </span>
            <p className="text-xs text-slate-400 leading-relaxed">
              Targeted for NeurIPS ENLSP &amp; ICLR Foundation Model Safety tracks. Checkpoints, code, and datasets will be made available under CC-BY-4.0.
            </p>
            <div className="pt-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-cyan-400">
                <GitBranch className="w-3 h-3" />
                <span>Deterministic Seed: 42</span>
              </span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <div>
            © {RESEARCH_METADATA.year} {RESEARCH_METADATA.authors[0].affiliation}. Research Proposal for Academic &amp; Industrial Evaluation.
          </div>

          <div className="flex items-center gap-4">
            <span className="font-mono text-cyan-400/80">PyTorch 2.3 • AutoAWQ • vLLM • Colab T4</span>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors cursor-pointer"
              title="Back to Top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
