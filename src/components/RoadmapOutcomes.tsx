'use client';

import React from 'react';
import { 
  Bookmark, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  FileCheck, 
  LineChart, 
  ShieldCheck, 
  Award, 
  ArrowRight,
  GitBranch,
  Layers,
  Cpu
} from 'lucide-react';
import { ROADMAP_ITEMS } from '@/data/researchData';

export const RoadmapOutcomes: React.FC = () => {
  return (
    <section id="roadmap" className="py-16 md:py-24 relative border-t border-slate-800/80 bg-[#0B0F19]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/50 text-cyan-400 text-xs font-mono mb-3">
            <Bookmark className="w-3.5 h-3.5" />
            <span>Research Deliverables</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
            Expected Outcomes &amp; Research Roadmap
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-400 max-w-2xl">
            Tangible contributions to the AI community: open benchmarks, Pareto trade-off guidelines, and a novel factual-saliency-aware compression framework.
          </p>
        </div>

        {/* Deliverables Modern Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {/* Card 1 */}
          <div className="glass-panel rounded-2xl p-6 border-slate-800 hover:border-cyan-500/50 transition-all flex flex-col justify-between group">
            <div>
              <div className="w-10 h-10 rounded-xl bg-cyan-950/70 border border-cyan-800/60 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-105 transition-transform">
                <FileCheck className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider font-semibold">
                Deliverable 01
              </span>
              <h3 className="text-lg font-bold text-white mt-1 mb-2">
                HUQ-Bench Dataset
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Standardized open-source benchmark specifically auditing quantization-induced factual collapse across 817 adversarial queries.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>Hugging Face Dataset</span>
              <span className="text-cyan-400 font-semibold">Open Science</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="glass-panel rounded-2xl p-6 border-slate-800 hover:border-indigo-500/50 transition-all flex flex-col justify-between group">
            <div>
              <div className="w-10 h-10 rounded-xl bg-indigo-950/70 border border-indigo-800/60 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-105 transition-transform">
                <LineChart className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-mono text-indigo-400 uppercase tracking-wider font-semibold">
                Deliverable 02
              </span>
              <h3 className="text-lg font-bold text-white mt-1 mb-2">
                Pareto Trade-Off Curves
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Empirical accuracy vs. bit-width frontier curves detailing the exact breakdown threshold where factual decay outpaces memory savings.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>Bit-Width Spectrum</span>
              <span className="text-indigo-400 font-semibold">Edge Guidelines</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="glass-panel rounded-2xl p-6 border-slate-800 hover:border-emerald-500/50 transition-all flex flex-col justify-between group">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-950/70 border border-emerald-800/60 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider font-semibold">
                Deliverable 03
              </span>
              <h3 className="text-lg font-bold text-white mt-1 mb-2">
                FSAQ Mitigation Engine
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Novel Factual-Saliency-Aware Quantization that preserves top factual projection channels in FP16, recovering &gt;80% truthfulness at &lt;4% VRAM cost.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>PyTorch / AWQ Extension</span>
              <span className="text-emerald-400 font-semibold">+82% Recovery</span>
            </div>
          </div>

          {/* Card 4 */}
          <div className="glass-panel rounded-2xl p-6 border-slate-800 hover:border-amber-500/50 transition-all flex flex-col justify-between group">
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-950/70 border border-amber-800/60 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-105 transition-transform">
                <Award className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-mono text-amber-400 uppercase tracking-wider font-semibold">
                Deliverable 04
              </span>
              <h3 className="text-lg font-bold text-white mt-1 mb-2">
                Publishable Workshop Paper
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Full academic paper targeting NeurIPS ENLSP or ICLR Foundation Model Safety tracks, complete with reproducible checkpoints.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>Target Venue</span>
              <span className="text-amber-400 font-semibold">NeurIPS / ICLR</span>
            </div>
          </div>
        </div>

        {/* Milestone Timeline Roadmap */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-8 pb-4 border-b border-slate-800">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
                14-Week Execution Schedule
              </span>
              <h3 className="text-xl font-bold text-white mt-0.5">
                Research Milestones &amp; Project Phases
              </h3>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> Done
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" /> Active
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-600" /> Upcoming
              </span>
            </div>
          </div>

          <div className="space-y-6">
            {ROADMAP_ITEMS.map((item, index) => {
              const isDone = item.status === 'completed';
              const isInProgress = item.status === 'in-progress';

              return (
                <div
                  key={item.phase}
                  className={`p-5 rounded-2xl border transition-all ${
                    isInProgress
                      ? 'bg-slate-900/90 border-cyan-500/50 shadow-md shadow-cyan-500/5'
                      : isDone
                      ? 'bg-slate-950/80 border-emerald-900/40'
                      : 'bg-slate-950/40 border-slate-800/60'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl font-mono text-xs font-bold flex items-center justify-center ${
                        isDone
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : isInProgress
                          ? 'bg-cyan-950 text-cyan-400 border border-cyan-700 animate-pulse'
                          : 'bg-slate-800 text-slate-500'
                      }`}>
                        {isDone ? <CheckCircle2 className="w-4 h-4" /> : `0${index + 1}`}
                      </div>
                      <div>
                        <span className="text-[11px] font-mono text-slate-400 block">
                          {item.phase} • <span className="text-cyan-400 font-semibold">{item.duration}</span>
                        </span>
                        <h4 className="text-base font-bold text-white">
                          {item.title}
                        </h4>
                      </div>
                    </div>

                    <div>
                      {isDone && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
                          COMPLETED
                        </span>
                      )}
                      {isInProgress && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold bg-cyan-950 text-cyan-300 border border-cyan-800 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                          IN ACTIVE INVESTIGATION
                        </span>
                      )}
                      {item.status === 'upcoming' && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold bg-slate-800 text-slate-400">
                          SCHEDULED
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4 pl-0 md:pl-11">
                    {item.description}
                  </p>

                  <div className="pl-0 md:pl-11 grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {item.deliverables.map((deliv, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-xs font-mono text-slate-300 p-2 rounded-lg bg-slate-900/60 border border-slate-800/80"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                        <span className="truncate">{deliv}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
