'use client';

import React, { useState } from 'react';
import { 
  Layers, 
  Cpu, 
  Search, 
  Database, 
  BarChart, 
  Code2, 
  Copy, 
  Check, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  GitBranch,
  Terminal,
  Activity
} from 'lucide-react';
import { METHODOLOGY_STEPS } from '@/data/researchData';

export const MethodologyPipeline: React.FC = () => {
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  const activeStep = METHODOLOGY_STEPS[activeStepIndex];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeStep.codeSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <section id="pipeline" className="py-16 md:py-24 relative border-t border-slate-800/80 bg-[#0B0F19]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/50 text-cyan-400 text-xs font-mono mb-3">
            <Layers className="w-3.5 h-3.5" />
            <span>Experimental Architecture</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
            Methodology &amp; Empirical Pipeline
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-400 max-w-2xl">
            A 4-stage empirical verification pipeline systematically isolating factual degeneration from model selection to layer-wise saliency breakdown.
          </p>
        </div>

        {/* Step Tracker / Flowchart Navigation */}
        <div className="relative mb-10">
          {/* Connector Line on Desktop */}
          <div className="hidden lg:block absolute top-7 left-12 right-12 h-0.5 bg-slate-800 -z-0" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
            {METHODOLOGY_STEPS.map((step, idx) => {
              const isSelected = activeStepIndex === idx;
              return (
                <button
                  key={step.step}
                  onClick={() => setActiveStepIndex(idx)}
                  className={`text-left p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-slate-900/90 border-cyan-500/70 shadow-lg shadow-cyan-500/10'
                      : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/40'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-8 h-8 rounded-xl font-mono text-xs font-bold flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'bg-cyan-400 text-slate-950 shadow-md shadow-cyan-400/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        0{step.step}
                      </div>
                      <span className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded ${
                        isSelected ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'text-slate-500'
                      }`}>
                        Phase 0{step.step}
                      </span>
                    </div>

                    <h4 className={`text-sm font-bold tracking-tight mb-1 transition-colors ${
                      isSelected ? 'text-white' : 'text-slate-300'
                    }`}>
                      {step.title}
                    </h4>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {step.subtitle}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-500">
                      {step.tools[0]}
                    </span>
                    <span className={isSelected ? 'text-cyan-400 font-semibold flex items-center gap-1' : 'text-slate-500'}>
                      {isSelected ? 'Active View' : 'Inspect'} →
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Step Detail Panel */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border-slate-800/90 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Step Overview Column (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-800">
                    STAGE 0{activeStep.step} DETAILED SPECIFICATION
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {activeStep.title}
                </h3>
                <p className="text-xs font-mono text-cyan-300/80 mt-1">
                  {activeStep.subtitle}
                </p>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed">
                {activeStep.description}
              </p>

              {/* Mathematical / Algorithmic Action */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold block mb-1">
                  Mathematical Action / Formal Objective:
                </span>
                <div className="text-xs font-mono text-cyan-300 bg-slate-950 p-2.5 rounded-lg border border-slate-800 overflow-x-auto">
                  {activeStep.keyAction}
                </div>
              </div>

              {/* Empirical Metric Observed */}
              <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-900/40 text-xs text-slate-300">
                <div className="flex items-center gap-2 text-cyan-400 font-mono font-semibold mb-1">
                  <Activity className="w-3.5 h-3.5" />
                  <span>Key Telemetric Observation</span>
                </div>
                <p className="leading-relaxed font-mono text-cyan-200/90">
                  {activeStep.metricObserved}
                </p>
              </div>

              {/* Tools Stack Used in this phase */}
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold block mb-2">
                  Software Stack &amp; Libraries
                </span>
                <div className="flex flex-wrap gap-2">
                  {activeStep.tools.map((tool) => (
                    <span
                      key={tool}
                      className="px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-800/80 text-slate-300 border border-slate-700/60"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Code / Pipeline Implementation Column (7 Cols) */}
            <div className="lg:col-span-7">
              <div className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl">
                {/* Code Window Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-slate-900/90 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                      <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                      <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                    </div>
                    <span className="text-xs font-mono text-slate-400 ml-2 flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                      <span>phase_{activeStep.step}_{activeStep.codeLanguage}.py</span>
                    </span>
                  </div>

                  <button
                    onClick={handleCopyCode}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
                  >
                    {copiedCode ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Code Body */}
                <pre className="p-4 sm:p-5 text-xs sm:text-sm font-mono text-slate-300 overflow-x-auto leading-relaxed max-h-[420px] scrollbar-thin">
                  <code>{activeStep.codeSnippet}</code>
                </pre>

                {/* Code Footer / Environment execution badge */}
                <div className="px-4 py-2.5 bg-slate-900/50 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Cpu className="w-3 h-3 text-cyan-400" />
                    <span>Colab T4 (16GB GDDR6) PyTorch 2.3 Ready</span>
                  </span>
                  <span className="text-emerald-400">
                    Deterministic Reproducibility Seed: 42
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
