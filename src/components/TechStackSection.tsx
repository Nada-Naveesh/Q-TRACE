'use client';

import React, { useState } from 'react';
import { 
  Cpu, 
  Layers, 
  Terminal, 
  Database, 
  ShieldCheck, 
  Zap, 
  HardDrive, 
  Server, 
  CheckCircle2, 
  ExternalLink 
} from 'lucide-react';
import { TECH_STACK } from '@/data/researchData';

export const TechStackSection: React.FC = () => {
  const [selectedGpuAllocation, setSelectedGpuAllocation] = useState<number>(4);

  return (
    <section className="py-16 md:py-24 relative border-t border-slate-800/80 bg-[#0B0F19]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/50 text-cyan-400 text-xs font-mono mb-3">
            <Cpu className="w-3.5 h-3.5" />
            <span>Infrastructure &amp; Tools</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
            Research Tech Stack &amp; Hardware Profile
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-400 max-w-2xl">
            Optimized for reproducible experiments on accessible cloud compute (Google Colab T4 16GB) without requiring high-cost datacenter clusters.
          </p>
        </div>

        {/* Tech Stack Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {TECH_STACK.map((item) => (
            <div
              key={item.name}
              className="glass-panel rounded-2xl p-5 sm:p-6 border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-semibold">
                    {item.badge}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {item.category}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-1">
                  {item.name}
                </h3>
                <p className="text-xs text-cyan-400/90 font-mono mb-2">
                  {item.role}
                </p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 className="w-3 h-3" /> Colab T4 Verified
                </span>
                <span className="text-slate-400">Open-Source</span>
              </div>
            </div>
          ))}
        </div>

        {/* Colab T4 16GB VRAM Budget Breakdown Card */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border-slate-800/90 shadow-xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="max-w-xl">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-indigo-950 text-indigo-400 border border-indigo-800">
                  HARDWARE BUDGET FEASIBILITY
                </span>
              </div>
              <h3 className="text-xl font-bold text-white">
                Google Colab T4 GPU (16 GB GDDR6) Concurrency
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                By compressing 1B-1.5B models to 4-bit AWQ (~0.95 GB VRAM), a single inexpensive Colab T4 GPU can host up to <strong className="text-cyan-400">12 parallel inference instances</strong> or run massive batched TruthfulQA audits with large KV-cache buffers simultaneously.
              </p>
            </div>

            {/* Visual Memory Bar */}
            <div className="w-full lg:w-96 p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="flex justify-between items-center text-xs font-mono mb-2">
                <span className="text-slate-400">Colab T4 Total VRAM:</span>
                <span className="text-white font-bold">16.0 GB</span>
              </div>

              {/* Stacked Memory Bar */}
              <div className="h-4 w-full bg-slate-800 rounded-lg overflow-hidden flex">
                {/* 4-Bit Model Weights */}
                <div className="bg-cyan-500 h-full w-[6%]" title="4-Bit Quantized SLM (~0.95 GB)" />
                {/* KV Cache Buffer */}
                <div className="bg-indigo-500 h-full w-[18%]" title="vLLM PagedAttention KV Cache (~3.0 GB)" />
                {/* Free Headroom */}
                <div className="bg-emerald-500/20 h-full flex-1" title="Available Headroom (~12 GB)" />
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2 text-[10px] font-mono text-center">
                <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                  <div className="text-cyan-400 font-bold">~0.95 GB</div>
                  <div className="text-slate-400">INT4 Model</div>
                </div>
                <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                  <div className="text-indigo-400 font-bold">~3.0 GB</div>
                  <div className="text-slate-400">vLLM Cache</div>
                </div>
                <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                  <div className="text-emerald-400 font-bold">~12.0 GB</div>
                  <div className="text-slate-400">Free Margin</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
