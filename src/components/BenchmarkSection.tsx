'use client';

import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  ArrowUpDown, 
  Search, 
  Download, 
  Filter, 
  Info, 
  CheckCircle, 
  TrendingUp, 
  TrendingDown, 
  Sliders,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { BENCHMARK_DATA } from '@/data/researchData';
import { BenchmarkRow, PrecisionLevel } from '@/types/research';

export const BenchmarkSection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModelFilter, setSelectedModelFilter] = useState<string>('all');
  const [selectedPrecisionFilter, setSelectedPrecisionFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<keyof BenchmarkRow>('vramGb');
  const [sortAsc, setSortAsc] = useState<boolean>(true);
  const [chartView, setChartView] = useState<'pareto' | 'hallucination' | 'perplexity'>('pareto');
  const [hoveredPoint, setHoveredPoint] = useState<BenchmarkRow | null>(null);

  // Filter & Sort Logic
  const filteredData = useMemo(() => {
    return BENCHMARK_DATA.filter((row) => {
      const matchesSearch = row.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            row.precision.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesModel = selectedModelFilter === 'all' || row.model.toLowerCase().includes(selectedModelFilter.toLowerCase());
      const matchesPrecision = selectedPrecisionFilter === 'all' || row.precision === selectedPrecisionFilter;
      return matchesSearch && matchesModel && matchesPrecision;
    }).sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortAsc ? valA - valB : valB - valA;
      }
      return sortAsc 
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });
  }, [searchQuery, selectedModelFilter, selectedPrecisionFilter, sortField, sortAsc]);

  const handleSort = (field: keyof BenchmarkRow) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false); // default descending for metrics
    }
  };

  const handleExportCSV = () => {
    const headers = ["Model", "Parameters", "Precision", "BitWidth", "VRAM_GB", "Perplexity_PPL", "TruthfulQA_MC2", "HaluEval_Score", "Hallucination_Rate", "Colab_T4_Status"];
    const csvContent = [
      headers.join(","),
      ...filteredData.map(r => [
        `"${r.model}"`,
        r.parameters,
        r.precision,
        r.bitWidth,
        r.vramGb,
        r.perplexity,
        r.truthfulQAScore,
        r.haluEvalScore,
        r.hallucinationRate,
        r.t4Compatibility
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `slm_quant_benchmark_results.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="benchmarks" className="py-16 md:py-24 relative border-t border-slate-800/80 bg-[#0B0F19]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/50 text-cyan-400 text-xs font-mono mb-3">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Empirical Results</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
            Comprehensive Benchmark &amp; Trade-Off Analysis
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-400 max-w-2xl">
            Multi-model evaluation matrix assessing TruthfulQA factual retention, HaluEval error margins, and VRAM memory ceilings across bit-widths.
          </p>
        </div>

        {/* Interactive Chart Container */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border-slate-800/90 shadow-xl mb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
                Interactive Pareto Frontier
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-white mt-0.5">
                {chartView === 'pareto' && 'Factual Accuracy (TruthfulQA %) vs. VRAM Footprint (GB)'}
                {chartView === 'hallucination' && 'Hallucination Rate (%) vs. Quantization Bit-Width'}
                {chartView === 'perplexity' && 'The Perplexity Paradox: PPL vs. Hallucination Drift'}
              </h3>
            </div>

            {/* Chart View Toggle Tabs */}
            <div className="inline-flex p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium self-start md:self-auto">
              <button
                onClick={() => setChartView('pareto')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  chartView === 'pareto' ? 'bg-cyan-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Accuracy vs VRAM
              </button>
              <button
                onClick={() => setChartView('hallucination')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  chartView === 'hallucination' ? 'bg-cyan-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Hallucination Curve
              </button>
              <button
                onClick={() => setChartView('perplexity')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  chartView === 'perplexity' ? 'bg-cyan-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Perplexity Paradox
              </button>
            </div>
          </div>

          {/* SVG Visual Representation */}
          <div className="relative w-full h-[320px] sm:h-[380px] bg-slate-950/70 rounded-2xl border border-slate-800 p-4 overflow-hidden flex flex-col justify-between">
            {/* Grid Lines */}
            <div className="absolute inset-0 p-8 flex flex-col justify-between pointer-events-none opacity-20">
              <div className="w-full border-b border-dashed border-slate-400" />
              <div className="w-full border-b border-dashed border-slate-400" />
              <div className="w-full border-b border-dashed border-slate-400" />
              <div className="w-full border-b border-dashed border-slate-400" />
            </div>

            {/* Dynamic Visual Plot Points */}
            <div className="relative w-full h-full flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 800 320">
                {/* SVG Coordinate Guides */}
                <line x1="60" y1="280" x2="760" y2="280" stroke="#334155" strokeWidth="2" />
                <line x1="60" y1="20" x2="60" y2="280" stroke="#334155" strokeWidth="2" />

                {/* Axis Labels */}
                {chartView === 'pareto' && (
                  <>
                    <text x="410" y="310" fill="#94a3b8" fontSize="12" textAnchor="middle" fontFamily="monospace">
                      VRAM Footprint (GB) → [Edge-Friendly 0.8GB to FP16 4.0GB]
                    </text>
                    <text x="25" y="150" fill="#94a3b8" fontSize="12" textAnchor="middle" transform="rotate(-90 25 150)" fontFamily="monospace">
                      TruthfulQA Accuracy (%) →
                    </text>
                  </>
                )}

                {chartView === 'hallucination' && (
                  <>
                    <text x="410" y="310" fill="#94a3b8" fontSize="12" textAnchor="middle" fontFamily="monospace">
                      Quantization Bit-Width → [4-bit PTQ to 16-bit FP16 Baseline]
                    </text>
                    <text x="25" y="150" fill="#94a3b8" fontSize="12" textAnchor="middle" transform="rotate(-90 25 150)" fontFamily="monospace">
                      Hallucination Error Rate (%) →
                    </text>
                  </>
                )}

                {chartView === 'perplexity' && (
                  <>
                    <text x="410" y="310" fill="#94a3b8" fontSize="12" textAnchor="middle" fontFamily="monospace">
                      Validation Perplexity (PPL) → [5.9 to 7.8 PPL]
                    </text>
                    <text x="25" y="150" fill="#94a3b8" fontSize="12" textAnchor="middle" transform="rotate(-90 25 150)" fontFamily="monospace">
                      Hallucination Rate (%) →
                    </text>
                  </>
                )}

                {/* Pareto Frontier Curves & Lines */}
                {chartView === 'pareto' && (
                  <path
                    d="M 120 220 Q 280 180 420 100 T 700 70"
                    fill="none"
                    stroke="#06b6d4"
                    strokeWidth="3"
                    strokeDasharray="4 4"
                    className="opacity-70"
                  />
                )}

                {chartView === 'hallucination' && (
                  <path
                    d="M 120 70 Q 320 180 500 230 T 700 250"
                    fill="none"
                    stroke="#f43f5e"
                    strokeWidth="3"
                    strokeDasharray="4 4"
                    className="opacity-70"
                  />
                )}

                {/* Individual Model Points */}
                {BENCHMARK_DATA.map((row) => {
                  let cx = 100;
                  let cy = 100;

                  if (chartView === 'pareto') {
                    // X maps VRAM (0.8GB -> 4.0GB) to (100 -> 720)
                    cx = 100 + ((row.vramGb - 0.8) / (4.0 - 0.8)) * 620;
                    // Y maps TruthfulQA (40% -> 80%) to (260 -> 40)
                    cy = 260 - ((row.truthfulQAScore - 40) / (80 - 40)) * 220;
                  } else if (chartView === 'hallucination') {
                    // X maps bitWidth (4 -> 16) to (120 -> 700)
                    cx = 120 + ((row.bitWidth - 4) / 12) * 580;
                    // Y maps hallucination rate (8% -> 45%) to (250 -> 50)
                    cy = 250 - ((row.hallucinationRate - 8) / (45 - 8)) * 200;
                  } else {
                    // Perplexity X (5.8 -> 7.8) to (120 -> 700)
                    cx = 120 + ((row.perplexity - 5.8) / 2.0) * 580;
                    // Hallucination Y
                    cy = 250 - ((row.hallucinationRate - 8) / (45 - 8)) * 200;
                  }

                  const isHovered = hoveredPoint?.id === row.id;
                  const isAwqOrGptq = row.precision.includes('INT4');
                  const isFp16 = row.precision === 'FP16';

                  const fillColor = isFp16 ? '#10b981' : isAwqOrGptq ? '#f43f5e' : '#38bdf8';

                  return (
                    <g key={row.id}>
                      <circle
                        cx={cx}
                        cy={cy}
                        r={isHovered ? 9 : 6}
                        fill={fillColor}
                        stroke="#0b0f19"
                        strokeWidth="2"
                        className="cursor-pointer transition-all duration-200"
                        onMouseEnter={() => setHoveredPoint(row)}
                        onMouseLeave={() => setHoveredPoint(null)}
                      />
                      <text
                        x={cx}
                        y={cy - 12}
                        fill="#cbd5e1"
                        fontSize="9"
                        textAnchor="middle"
                        fontFamily="monospace"
                        className="pointer-events-none hidden sm:inline"
                      >
                        {row.model.split(' ')[0]} {row.precision}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Hover Tooltip Overlay */}
              {hoveredPoint && (
                <div className="absolute top-4 right-4 p-3 rounded-xl bg-slate-900/95 border border-cyan-500/50 text-xs shadow-2xl z-20 font-mono w-64 animate-fadeIn pointer-events-none">
                  <div className="font-bold text-white flex items-center justify-between border-b border-slate-800 pb-1 mb-1.5">
                    <span>{hoveredPoint.model}</span>
                    <span className="text-cyan-400 font-semibold">[{hoveredPoint.precision}]</span>
                  </div>
                  <div className="space-y-1 text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-400">VRAM Footprint:</span>
                      <span className="text-white font-semibold">{hoveredPoint.vramGb} GB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">TruthfulQA Score:</span>
                      <span className="text-emerald-400 font-semibold">{hoveredPoint.truthfulQAScore}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Hallucination Rate:</span>
                      <span className="text-rose-400 font-semibold">{hoveredPoint.hallucinationRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Perplexity:</span>
                      <span className="text-indigo-300 font-semibold">{hoveredPoint.perplexity} PPL</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Legend */}
            <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>FP16 Baseline (Oracle)</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
                  <span>INT8 Quantized</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span>INT4 AWQ / GPTQ</span>
                </span>
              </div>
              <span className="text-cyan-400">
                Hover any node for granular telemetry
              </span>
            </div>
          </div>
        </div>

        {/* Data Table Section */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border-slate-800/90 shadow-xl">
          {/* Controls Bar: Filters, Search, Export */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-6">
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Search Bar */}
              <div className="relative min-w-[220px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter model, precision..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              {/* Model Dropdown Filter */}
              <select
                value={selectedModelFilter}
                onChange={(e) => setSelectedModelFilter(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono cursor-pointer"
              >
                <option value="all">All Architecture Families</option>
                <option value="llama">Llama 3.2 1B</option>
                <option value="qwen">Qwen 2.5 1.5B</option>
                <option value="smol">SmolLM2 1.7B</option>
              </select>

              {/* Precision Dropdown Filter */}
              <select
                value={selectedPrecisionFilter}
                onChange={(e) => setSelectedPrecisionFilter(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono cursor-pointer"
              >
                <option value="all">All Precision Levels</option>
                <option value="FP16">FP16 (16-bit)</option>
                <option value="INT8">INT8 (8-bit)</option>
                <option value="INT4_AWQ">INT4 AWQ (4-bit)</option>
                <option value="INT4_GPTQ">INT4 GPTQ (4-bit)</option>
              </select>
            </div>

            {/* Export CSV Button */}
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Export Benchmark (CSV)</span>
            </button>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto rounded-2xl border border-slate-800">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Model Identifier</th>
                  <th className="py-3.5 px-3 font-semibold cursor-pointer hover:text-white" onClick={() => handleSort('precision')}>
                    <span className="flex items-center gap-1">Precision <ArrowUpDown className="w-3 h-3" /></span>
                  </th>
                  <th className="py-3.5 px-3 font-semibold cursor-pointer hover:text-white" onClick={() => handleSort('bitWidth')}>
                    <span className="flex items-center gap-1">Bits <ArrowUpDown className="w-3 h-3" /></span>
                  </th>
                  <th className="py-3.5 px-3 font-semibold cursor-pointer hover:text-white" onClick={() => handleSort('vramGb')}>
                    <span className="flex items-center gap-1">VRAM (GB) <ArrowUpDown className="w-3 h-3" /></span>
                  </th>
                  <th className="py-3.5 px-3 font-semibold cursor-pointer hover:text-white" onClick={() => handleSort('perplexity')}>
                    <span className="flex items-center gap-1">PPL <ArrowUpDown className="w-3 h-3" /></span>
                  </th>
                  <th className="py-3.5 px-3 font-semibold cursor-pointer hover:text-white" onClick={() => handleSort('truthfulQAScore')}>
                    <span className="flex items-center gap-1">TruthfulQA <ArrowUpDown className="w-3 h-3" /></span>
                  </th>
                  <th className="py-3.5 px-3 font-semibold cursor-pointer hover:text-white" onClick={() => handleSort('hallucinationRate')}>
                    <span className="flex items-center gap-1">Hallucination % <ArrowUpDown className="w-3 h-3" /></span>
                  </th>
                  <th className="py-3.5 px-4 font-semibold text-right">Colab T4 Fit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 bg-slate-950/40">
                {filteredData.map((row) => {
                  const isInt4 = row.precision.includes('INT4');
                  const isFp16 = row.precision === 'FP16';

                  return (
                    <tr key={row.id} className="hover:bg-slate-900/50 transition-colors">
                      <td className="py-3 px-4 font-sans font-medium text-white">
                        <div className="flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full ${isFp16 ? 'bg-emerald-400' : isInt4 ? 'bg-rose-400' : 'bg-cyan-400'}`} />
                          <span className="font-semibold">{row.model}</span>
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          isFp16 ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800' :
                          isInt4 ? 'bg-rose-950/80 text-rose-300 border border-rose-800' :
                          'bg-cyan-950/80 text-cyan-300 border border-cyan-800'
                        }`}>
                          {row.precision}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-slate-300">
                        {row.bitWidth}-bit
                      </td>

                      <td className="py-3 px-3 text-cyan-300 font-semibold">
                        {row.vramGb.toFixed(2)} GB
                      </td>

                      <td className="py-3 px-3 text-slate-300">
                        {row.perplexity.toFixed(2)}
                      </td>

                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <span className={`font-semibold ${row.truthfulQAScore < 55 ? 'text-rose-400' : 'text-emerald-400'}`}>
                            {row.truthfulQAScore}%
                          </span>
                          <div className="w-12 h-1.5 bg-slate-800 rounded-full overflow-hidden hidden sm:block">
                            <div 
                              className={`h-full ${row.truthfulQAScore < 55 ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                              style={{ width: `${row.truthfulQAScore}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <span className={`font-semibold ${row.hallucinationRate > 25 ? 'text-rose-400' : 'text-slate-300'}`}>
                          {row.hallucinationRate}%
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <span className={`px-2 py-0.5 rounded text-[10px] ${
                          row.t4Compatibility === 'High-Throughput' ? 'bg-cyan-950 text-cyan-300' :
                          row.t4Compatibility === 'Optimal' ? 'bg-emerald-950 text-emerald-300' :
                          'bg-slate-800 text-slate-300'
                        }`}>
                          {row.t4Compatibility}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
            <span>Showing {filteredData.length} empirical evaluation configurations</span>
            <span className="text-cyan-400 font-mono">Dataset: TruthfulQA MC2 &amp; HaluEval 35k</span>
          </div>
        </div>
      </div>
    </section>
  );
};
