export type PrecisionLevel = 'FP16' | 'INT8' | 'INT4_AWQ' | 'INT4_GPTQ';

export interface ModelOption {
  id: string;
  name: string;
  family: string;
  parameters: string;
  architecture: string;
  defaultVram: number; // in GB
  basePerplexity: number;
}

export interface SimulationResult {
  precision: PrecisionLevel;
  precisionLabel: string;
  bitWidth: number;
  vramGb: number;
  perplexity: number;
  truthfulQAScore: number; // 0-100%
  hallucinationRate: number; // 0-100%
  latencyMs: number; // per token ms
  throughputTokPerSec: number;
  outputText: string;
  factualStatus: 'verified' | 'minor_drift' | 'severe_hallucination' | 'critical_collapse';
  factualExplanation: string;
  highlightTokens: {
    text: string;
    status: 'correct' | 'warning' | 'hallucinated';
    tooltip?: string;
  }[];
}

export interface PromptScenario {
  id: string;
  title: string;
  category: string;
  prompt: string;
  groundTruth: string;
  results: Record<PrecisionLevel, SimulationResult>;
}

export interface BenchmarkRow {
  id: string;
  model: string;
  parameters: string;
  precision: PrecisionLevel;
  bitWidth: number;
  vramGb: number;
  perplexity: number;
  truthfulQAScore: number;
  haluEvalScore: number;
  hallucinationRate: number;
  t4Compatibility: 'Optimal' | 'Near-Limit' | 'High-Throughput' | 'Baseline';
}

export interface MethodologyStep {
  step: number;
  title: string;
  subtitle: string;
  description: string;
  tools: string[];
  keyAction: string;
  codeSnippet: string;
  codeLanguage: string;
  metricObserved: string;
}

export interface RoadmapItem {
  phase: string;
  duration: string;
  status: 'completed' | 'in-progress' | 'upcoming';
  title: string;
  description: string;
  deliverables: string[];
}
