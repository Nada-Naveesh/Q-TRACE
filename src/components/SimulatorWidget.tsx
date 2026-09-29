'use client';

import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  Sliders, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Info, 
  Copy, 
  Check, 
  Sparkles, 
  Play, 
  Eye, 
  GitCompare, 
  RotateCcw,
  Zap,
  Gauge,
  Database,
  ArrowRight,
  ShieldCheck,
  TrendingDown,
  ChevronDown
} from 'lucide-react';
import { 
  PROMPT_SCENARIOS, 
  PRECISION_SPECS, 
  MODELS_AVAILABLE 
} from '@/data/researchData';
import { PrecisionLevel } from '@/types/research';

export const SimulatorWidget: React.FC = () => {
  const precisionSteps: PrecisionLevel[] = ['FP16', 'INT8', 'INT4_AWQ', 'INT4_GPTQ'];
  const [precisionIndex, setPrecisionIndex] = useState<number>(0);
  const selectedPrecision = precisionSteps[precisionIndex];

  const [selectedPromptId, setSelectedPromptId] = useState<string>('penicillin');
  const [selectedModelId, setSelectedModelId] = useState<string>('llama-3.2-1b');
  const [showDiff, setShowDiff] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [displayedTextLength, setDisplayedTextLength] = useState<number>(9999);
  const [hoveredTokenIndex, setHoveredTokenIndex] = useState<number | null>(null);

  // Active prompt scenario
  const currentScenario = PROMPT_SCENARIOS.find(p => p.id === selectedPromptId) || PROMPT_SCENARIOS[0];
  const currentResult = currentScenario.results[selectedPrecision];
  const fp16BaselineResult = currentScenario.results['FP16'];

  // Calculate dynamic scaling for selected model
  const selectedModel = MODELS_AVAILABLE.find(m => m.id === selectedModelId) || MODELS_AVAILABLE[0];
  const modelVramMultiplier = selectedModel.id === 'qwen-2.5-1.5b' ? 1.20 : selectedModel.id === 'smollm2-1.7b' ? 1.33 : 1.0;
  const currentVram = Number((currentResult.vramGb * modelVramMultiplier).toFixed(2));
  const fp16Vram = Number((fp16BaselineResult.vramGb * modelVramMultiplier).toFixed(2));
  const vramSavingsPercent = Math.round(((fp16Vram - currentVram) / fp16Vram) * 100);

  // Streaming effect simulation on demand
  const handleTriggerSimulate = () => {
    setIsSimulating(true);
    setDisplayedTextLength(0);
    const fullText = currentResult.outputText;
    let currentLength = 0;
    const interval = setInterval(() => {
      currentLength += 8;
      if (currentLength >= fullText.length) {
        setDisplayedTextLength(fullText.length);
        setIsSimulating(false);
        clearInterval(interval);
      } else {
        setDisplayedTextLength(currentLength);
      }
    }, 35);
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(currentResult.outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-950/60 text-emerald-400 border border-emerald-800/60">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Factually Verified (Oracle Level)</span>
          </span>
        );
      case 'minor_drift':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-950/60 text-amber-400 border border-amber-800/60">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Temporal / Attribution Drift</span>
          </span>
        );
      case 'severe_hallucination':
      case 'critical_collapse':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-950/60 text-rose-400 border border-rose-800/60">
            <XCircle className="w-3.5 h-3.5" />
            <span>Critical Factual Hallucination</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <section id="simulator" className="py-16 md:py-24 relative border-t border-slate-800/80 bg-[#0B0F19]">
      {/* Background Subtle Accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-cyan-600/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/50 text-cyan-400 text-xs font-mono mb-3">
            <Sliders className="w-3.5 h-3.5" />
            <span>Interactive Research Lab</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
            Quantization vs. Hallucination Simulator
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-400 max-w-2xl">
            Slide through precision levels from FP16 down to 4-bit INT4 AWQ and GPTQ. Observe how VRAM collapses while factual accuracy breaks down in real-time.
          </p>
        </div>

        {/* Main Simulator Card Container */}
        <div className="glass-panel rounded-3xl p-5 sm:p-8 border-slate-800/90 shadow-2xl relative">
          {/* Top Controls: Model Selector & Sample Prompt Selector */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-6 border-b border-slate-800/80">
            {/* Model Selector */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2 font-medium">
                1. Select Target Edge Model (SLM)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {MODELS_AVAILABLE.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setSelectedModelId(m.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium text-left border transition-all cursor-pointer ${
                      selectedModelId === m.id
                        ? 'bg-cyan-950/70 border-cyan-500/60 text-cyan-200 shadow-sm shadow-cyan-500/10'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-semibold truncate">{m.name.split(' ')[0]} {m.name.split(' ')[1]}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">{m.parameters}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Prompt Selector */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2 font-medium">
                2. Select Factual Probe Scenario
              </label>
              <div className="relative">
                <select
                  value={selectedPromptId}
                  onChange={(e) => {
                    setSelectedPromptId(e.target.value);
                    setDisplayedTextLength(9999);
                  }}
                  className="w-full bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-cyan-500 appearance-none font-medium cursor-pointer"
                >
                  {PROMPT_SCENARIOS.map((p) => (
                    <option key={p.id} value={p.id} className="bg-slate-900 text-slate-200">
                      [{p.category}] {p.title}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Precision Slider Section */}
          <div className="py-6 border-b border-slate-800/80">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-medium">
                  3. Precision Bit-Width Slider
                </span>
                <h4 className="text-base sm:text-lg font-bold text-white mt-0.5">
                  {PRECISION_SPECS[selectedPrecision].name}
                </h4>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-mono">
                  Quantization Mode:
                </span>
                <span className={`text-xs px-2.5 py-0.5 rounded font-mono font-semibold text-white bg-gradient-to-r ${PRECISION_SPECS[selectedPrecision].color}`}>
                  {PRECISION_SPECS[selectedPrecision].badge}
                </span>
              </div>
            </div>

            {/* Slider Track */}
            <div className="relative pt-2 pb-6">
              <input
                type="range"
                min="0"
                max="3"
                step="1"
                value={precisionIndex}
                onChange={(e) => {
                  setPrecisionIndex(parseInt(e.target.value));
                  setDisplayedTextLength(9999);
                }}
                className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
              />

              {/* Slider Ticks and Labels */}
              <div className="grid grid-cols-4 mt-3 text-center">
                {precisionSteps.map((p, idx) => (
                  <button
                    key={p}
                    onClick={() => {
                      setPrecisionIndex(idx);
                      setDisplayedTextLength(9999);
                    }}
                    className={`flex flex-col items-center group cursor-pointer transition-colors ${
                      precisionIndex === idx ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="text-xs sm:text-sm font-mono font-semibold">
                      {PRECISION_SPECS[p].label}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono mt-0.5">
                      {PRECISION_SPECS[p].bitWidth}-Bit
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Description of current PTQ scheme */}
            <p className="text-xs text-slate-400 bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 leading-relaxed">
              <strong className="text-slate-300 font-medium">Mechanism:</strong> {PRECISION_SPECS[selectedPrecision].description}
            </p>
          </div>

          {/* Live Metrics Grid (Dynamic Cards) */}
          <div className="py-6 border-b border-slate-800/80">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-medium">
                Live Empirical Telemetry
              </span>
              <span className="text-[11px] font-mono text-cyan-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                <span>Colab T4 Hardware Profile</span>
              </span>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {/* Metric 1: VRAM */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 relative overflow-hidden">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>VRAM Footprint</span>
                  <Database className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
                    {currentVram}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">GB</span>
                </div>
                {/* Savings bar */}
                <div className="mt-2.5">
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-cyan-400 transition-all duration-500 rounded-full"
                      style={{ width: `${Math.max(15, (currentVram / 4.0) * 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-mono mt-1 text-slate-400">
                    <span>Baseline: {fp16Vram} GB</span>
                    <span className="text-cyan-400 font-semibold">{vramSavingsPercent > 0 ? `-${vramSavingsPercent}%` : 'Baseline'}</span>
                  </div>
                </div>
              </div>

              {/* Metric 2: Perplexity */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 relative overflow-hidden">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>Validation Perplexity</span>
                  <Gauge className="w-3.5 h-3.5 text-indigo-400" />
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
                    {currentResult.perplexity.toFixed(2)}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">PPL</span>
                </div>
                {/* Perplexity badge */}
                <div className="mt-2.5 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-400">Δ from FP16:</span>
                  <span className={`font-semibold ${
                    currentResult.perplexity - fp16BaselineResult.perplexity > 0.8 
                      ? 'text-amber-400' 
                      : 'text-emerald-400'
                  }`}>
                    +{ (currentResult.perplexity - fp16BaselineResult.perplexity).toFixed(2) }
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1 truncate">
                  *Deceptively low error
                </div>
              </div>

              {/* Metric 3: TruthfulQA Accuracy */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 relative overflow-hidden">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>Factual Accuracy (TruthfulQA)</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className={`text-2xl sm:text-3xl font-extrabold font-mono ${
                    currentResult.truthfulQAScore < 50 ? 'text-rose-400' : currentResult.truthfulQAScore < 65 ? 'text-amber-400' : 'text-emerald-400'
                  }`}>
                    {currentResult.truthfulQAScore}%
                  </span>
                </div>
                <div className="mt-2.5">
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 rounded-full ${
                        currentResult.truthfulQAScore < 50 ? 'bg-rose-500' : currentResult.truthfulQAScore < 65 ? 'bg-amber-400' : 'bg-emerald-400'
                      }`}
                      style={{ width: `${currentResult.truthfulQAScore}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-mono mt-1 text-slate-400">
                    <span>MC2 Benchmark</span>
                    <span className="text-rose-400">
                      {currentResult.truthfulQAScore - fp16BaselineResult.truthfulQAScore < 0 ? `${(currentResult.truthfulQAScore - fp16BaselineResult.truthfulQAScore).toFixed(1)}%` : 'Baseline'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Metric 4: Hallucination Rate */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 relative overflow-hidden">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>Hallucination Rate (HaluEval)</span>
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className={`text-2xl sm:text-3xl font-extrabold font-mono ${
                    currentResult.hallucinationRate > 30 ? 'text-rose-400' : currentResult.hallucinationRate > 20 ? 'text-amber-400' : 'text-slate-200'
                  }`}>
                    {currentResult.hallucinationRate}%
                  </span>
                </div>
                <div className="mt-2.5">
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 rounded-full ${
                        currentResult.hallucinationRate > 30 ? 'bg-rose-500' : 'bg-amber-400'
                      }`}
                      style={{ width: `${currentResult.hallucinationRate * 2}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-mono mt-1 text-slate-400">
                    <span>Adversarial Queries</span>
                    <span className="text-rose-400 font-semibold">
                      +{ (currentResult.hallucinationRate - fp16BaselineResult.hallucinationRate).toFixed(1) }%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Model Prompt & Output Display Area */}
          <div className="pt-6">
            {/* Prompt Box */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-start sm:items-center gap-2.5">
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 shrink-0">
                  INPUT PROMPT
                </span>
                <span className="text-xs sm:text-sm text-slate-200 font-mono">
                  &ldquo;{currentScenario.prompt}&rdquo;
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setShowDiff(!showDiff)}
                  className={`px-2.5 py-1 text-xs rounded-lg font-medium border flex items-center gap-1.5 transition-all cursor-pointer ${
                    showDiff 
                      ? 'bg-indigo-950/80 border-indigo-500 text-indigo-300' 
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <GitCompare className="w-3 h-3" />
                  <span>{showDiff ? 'Hide FP16 Baseline Diff' : 'Compare with FP16 Baseline'}</span>
                </button>
                <button
                  onClick={handleTriggerSimulate}
                  disabled={isSimulating}
                  className="px-2.5 py-1 text-xs rounded-lg font-medium bg-cyan-950 border border-cyan-800 text-cyan-300 hover:bg-cyan-900/60 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Play className="w-3 h-3 text-cyan-400" />
                  <span>{isSimulating ? 'Simulating...' : 'Re-Run Stream'}</span>
                </button>
              </div>
            </div>

            {/* Generated Output Card */}
            <div className="rounded-2xl bg-slate-950/90 border border-slate-800 p-5 sm:p-6 relative">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-900">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-semibold text-slate-400">
                    GENERATED OUTPUT [{selectedPrecision}]
                  </span>
                  {getStatusBadge(currentResult.factualStatus)}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-slate-400">
                    Throughput: <strong className="text-cyan-400">{currentResult.throughputTokPerSec} tok/s</strong>
                  </span>
                  <button
                    onClick={handleCopyText}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors cursor-pointer"
                    title="Copy generated output"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Output Content with Interactive Token Highlight tooltips */}
              <div className="text-sm sm:text-base text-slate-200 leading-relaxed font-sans min-h-[70px]">
                {currentResult.highlightTokens.map((token, idx) => {
                  const isHallucinated = token.status === 'hallucinated';
                  const isWarning = token.status === 'warning';
                  const isCorrect = token.status === 'correct';

                  return (
                    <span
                      key={idx}
                      onMouseEnter={() => setHoveredTokenIndex(idx)}
                      onMouseLeave={() => setHoveredTokenIndex(null)}
                      className={`relative inline-block cursor-help transition-all rounded px-0.5 my-0.5 ${
                        isHallucinated
                          ? 'bg-rose-950/80 text-rose-300 font-semibold border-b-2 border-rose-500 line-through decoration-rose-500/80 shadow-sm shadow-rose-900/30'
                          : isWarning
                          ? 'bg-amber-950/60 text-amber-300 border-b-2 border-amber-500/80'
                          : ''
                      }`}
                    >
                      {token.text}

                      {/* Tooltip on token hover */}
                      {hoveredTokenIndex === idx && token.tooltip && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 shadow-2xl z-50 pointer-events-none animate-fadeIn font-normal no-underline">
                          <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider mb-1">
                            {isHallucinated ? (
                              <span className="text-rose-400 flex items-center gap-1">
                                <XCircle className="w-3 h-3" /> Factual Disruption
                              </span>
                            ) : (
                              <span className="text-amber-400 flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" /> Factual Drift
                              </span>
                            )}
                          </div>
                          <div className="leading-snug text-slate-300">{token.tooltip}</div>
                          <div className="mt-1.5 pt-1 border-t border-slate-800 text-[10px] text-slate-400 font-mono">
                            Mechanism: 4-bit weight rounding noise
                          </div>
                        </div>
                      )}
                    </span>
                  );
                })}
              </div>

              {/* Factual Audit Explanation */}
              <div className="mt-4 p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs flex items-start gap-2.5 text-slate-300">
                <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white">Factual Audit Breakdown: </span>
                  {currentResult.factualExplanation}
                </div>
              </div>

              {/* Side-by-side Baseline Diff Mode */}
              {showDiff && (
                <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-800/40">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-mono font-semibold mb-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>FP16 Baseline Oracle Output</span>
                    </div>
                    <p className="text-slate-300 italic leading-relaxed">
                      &ldquo;{fp16BaselineResult.outputText}&rdquo;
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="flex items-center gap-1.5 text-cyan-400 font-mono font-semibold mb-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Ground Truth Reference</span>
                    </div>
                    <p className="text-slate-300 italic leading-relaxed">
                      &ldquo;{currentScenario.groundTruth}&rdquo;
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
