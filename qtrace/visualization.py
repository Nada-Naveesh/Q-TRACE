import os
from typing import Dict, Any, List, Optional
import matplotlib
matplotlib.use('Agg') # Headless non-interactive backend
import matplotlib.pyplot as plt
import numpy as np

class Visualizer:
    """Generates research-grade scientific figures using Matplotlib saved directly to results/graphs/."""

    def __init__(self, output_dir: str = "results/graphs"):
        self.output_dir = output_dir
        os.makedirs(self.output_dir, exist_ok=True)
        self._setup_style()

    def _setup_style(self):
        plt.style.use('default')
        plt.rcParams['font.sans-serif'] = 'DejaVu Sans'
        plt.rcParams['font.family'] = 'sans-serif'
        plt.rcParams['figure.autolayout'] = True
        plt.rcParams['figure.dpi'] = 150

    def plot_precision_reliability(self, precision_scores: Dict[str, float], filename: str = "01_precision_reliability.png"):
        """Plot Q-TRACE Reliability Score across precision configurations."""
        fig, ax = plt.subplots(figsize=(8, 4.5))
        labels = list(precision_scores.keys())
        values = [precision_scores[k] for k in labels]
        colors = ['#10b981' if 'FP16' in k else '#f43f5e' if 'INT4' in k else '#06b6d4' for k in labels]

        bars = ax.bar(labels, values, color=colors, width=0.55, edgecolor='#0f172a', linewidth=1)
        ax.set_ylabel("Q-TRACE Reliability Score", fontsize=11, fontweight='bold')
        ax.set_title("Factual Reliability Across Quantization Pathways", fontsize=12, fontweight='bold')
        ax.set_ylim(0, 1.05)
        ax.grid(axis='y', linestyle='--', alpha=0.5)

        for bar in bars:
            height = bar.get_height()
            ax.annotate(f'{height:.2f}',
                        xy=(bar.get_x() + bar.get_width() / 2, height),
                        xytext=(0, 3), textcoords="offset points",
                        ha='center', va='bottom', fontsize=9, fontweight='bold')

        plt.savefig(os.path.join(self.output_dir, filename), dpi=150)
        plt.close(fig)

    def plot_precision_memory_latency(self, mem_data: Dict[str, float], lat_data: Dict[str, float]):
        """Plot memory storage and inference latency."""
        # Memory
        fig, ax = plt.subplots(figsize=(8, 4.5))
        keys = list(mem_data.keys())
        vals = [mem_data[k] for k in keys]
        ax.bar(keys, vals, color='#38bdf8', width=0.5, edgecolor='#0f172a')
        ax.set_ylabel("Storage Footprint (MB)", fontsize=11, fontweight='bold')
        ax.set_title("Model Parameter Memory Across Quantization Levels", fontsize=12, fontweight='bold')
        ax.grid(axis='y', linestyle='--', alpha=0.5)
        plt.savefig(os.path.join(self.output_dir, "04_precision_memory.png"), dpi=150)
        plt.close(fig)

        # Latency
        fig, ax = plt.subplots(figsize=(8, 4.5))
        lat_keys = list(lat_data.keys())
        lat_vals = [lat_data[k] for k in lat_keys]
        ax.bar(lat_keys, lat_vals, color='#f59e0b', width=0.5, edgecolor='#0f172a')
        ax.set_ylabel("Mean Latency (ms)", fontsize=11, fontweight='bold')
        ax.set_title("Inference Latency Across Quantization Levels", fontsize=12, fontweight='bold')
        ax.grid(axis='y', linestyle='--', alpha=0.5)
        plt.savefig(os.path.join(self.output_dir, "03_precision_latency.png"), dpi=150)
        plt.close(fig)

    def plot_layer_sensitivity(self, sensitive_layers: List[Dict[str, Any]], filename: str = "09_layer_sensitivity.png"):
        """Plot top sensitive modules by weight reconstruction error and representation drift."""
        top_k = sensitive_layers[:10]
        if not top_k:
            return
        labels = [(item["layer"].split(".")[-2] + "." + item["layer"].split(".")[-1] if len(item["layer"].split(".")) >= 2 else item["layer"]) for item in top_k]
        errors = [item["weight_rmse"] for item in top_k]

        fig, ax = plt.subplots(figsize=(10, 5))
        y_pos = np.arange(len(labels))
        ax.barh(y_pos, errors, color='#6366f1', edgecolor='#0f172a')
        ax.set_yticks(y_pos)
        ax.set_yticklabels(labels, fontsize=9)
        ax.invert_yaxis() # Top rank on top
        ax.set_xlabel("Weight RMSE (4-bit)", fontsize=11, fontweight='bold')
        ax.set_title("Top Sensitive Transformer Modules (Numerical Sensitivity)", fontsize=12, fontweight='bold')
        ax.grid(axis='x', linestyle='--', alpha=0.5)
        plt.savefig(os.path.join(self.output_dir, filename), dpi=150)
        plt.close(fig)

    def plot_representation_drift(self, layer_drifts: List[Dict[str, Any]], filename: str = "10_representation_drift.png"):
        """Plot layer-by-layer cosine distance showing representation divergence."""
        if not layer_drifts:
            return
        fig, ax = plt.subplots(figsize=(9, 4.5))
        layers = [d["layer_name"] for d in layer_drifts]
        cos_dists = [d["cosine_distance"] for d in layer_drifts]

        ax.plot(layers, cos_dists, marker='o', color='#ef4444', linewidth=2, markersize=5)
        ax.set_ylabel("Cosine Distance (1 - Cosine Sim)", fontsize=11, fontweight='bold')
        ax.set_xlabel("Transformer Layer", fontsize=11, fontweight='bold')
        ax.set_title("Layer-Wise Representation Drift (FP16 vs INT4)", fontsize=12, fontweight='bold')
        ax.tick_params(axis='x', rotation=45)
        ax.grid(True, linestyle='--', alpha=0.5)
        plt.savefig(os.path.join(self.output_dir, filename), dpi=150)
        plt.close(fig)

    def plot_critical_token_stability(self, stability_data: Dict[str, float], filename: str = "14_critical_token_stability.png"):
        """Plot Critical Token Stability across precision levels."""
        fig, ax = plt.subplots(figsize=(8, 4.5))
        labels = list(stability_data.keys())
        vals = [stability_data[k] for k in labels]

        ax.bar(labels, vals, color='#14b8a6', width=0.5, edgecolor='#0f172a')
        ax.set_ylabel("Critical Token Stability Ratio", fontsize=11, fontweight='bold')
        ax.set_title("Retention of Entities, Numbers, and Scientific Tokens", fontsize=12, fontweight='bold')
        ax.set_ylim(0, 1.05)
        ax.grid(axis='y', linestyle='--', alpha=0.5)
        plt.savefig(os.path.join(self.output_dir, filename), dpi=150)
        plt.close(fig)

    def plot_failure_taxonomy(self, failure_counts: Dict[str, int], filename: str = "15_failure_taxonomy.png"):
        """Plot categorical breakdown of observed factual failures."""
        if not failure_counts or sum(failure_counts.values()) == 0:
            return
        fig, ax = plt.subplots(figsize=(9, 5))
        categories = list(failure_counts.keys())
        counts = [failure_counts[k] for k in categories]

        ax.barh(categories, counts, color='#ec4899', edgecolor='#0f172a')
        ax.set_xlabel("Observed Frequency", fontsize=11, fontweight='bold')
        ax.set_title("Quantization-Induced Failure Taxonomy Breakdown", fontsize=12, fontweight='bold')
        ax.grid(axis='x', linestyle='--', alpha=0.5)
        plt.savefig(os.path.join(self.output_dir, filename), dpi=150)
        plt.close(fig)

    def plot_repair_curve(self, repair_search_history: List[Dict[str, Any]], filename: str = "22_repair_search.png"):
        """Plot Greedy Repair Search Curve showing recovery vs memory cost."""
        if not repair_search_history:
            return
        fig, ax = plt.subplots(figsize=(8, 4.5))
        fractions = [f"{int(r['repair_fraction']*100)}%" for r in repair_search_history]
        scores = [r["measured_score"] for r in repair_search_history]

        ax.plot(fractions, scores, marker='s', color='#10b981', linewidth=2.5, markersize=7)
        ax.set_xlabel("Repaired Module Fraction (Restored to INT8)", fontsize=11, fontweight='bold')
        ax.set_ylabel("Recovered Reliability Score", fontsize=11, fontweight='bold')
        ax.set_title("Greedy Quantization Repair Recovery Curve", fontsize=12, fontweight='bold')
        ax.grid(True, linestyle='--', alpha=0.5)
        plt.savefig(os.path.join(self.output_dir, filename), dpi=150)
        plt.close(fig)

    def plot_adaptive_distribution(self, adaptive_counts: Dict[str, int], filename: str = "23_adaptive_precision.png"):
        """Plot routing distribution across INT4, INT8, and FP16."""
        fig, ax = plt.subplots(figsize=(7, 4.5))
        labels = list(adaptive_counts.keys())
        counts = [adaptive_counts[k] for k in labels]
        colors = ['#f43f5e', '#06b6d4', '#10b981']

        ax.pie(counts, labels=labels, autopct='%1.1f%%', colors=colors, startangle=140,
               wedgeprops={'edgecolor': '#0f172a', 'linewidth': 1.5})
        ax.set_title("Adaptive Precision Routing Escalation Distribution", fontsize=12, fontweight='bold')
        plt.savefig(os.path.join(self.output_dir, filename), dpi=150)
        plt.close(fig)

    def plot_pareto_frontier(self, pareto_points: List[Dict[str, Any]], filename: str = "25_pareto_frontier.png"):
        """Plot Reliability vs Efficiency Pareto Frontier."""
        if not pareto_points:
            return
        fig, ax = plt.subplots(figsize=(8, 5))
        for pt in pareto_points:
            x = pt["efficiency_score"] # e.g. compression ratio or throughput
            y = pt["reliability_score"]
            name = pt["name"]
            color = '#10b981' if 'FP16' in name else '#06b6d4' if 'Repair' in name or 'Adaptive' in name else '#f43f5e'
            ax.scatter(x, y, s=120, color=color, edgecolors='#0f172a', zorder=5)
            ax.annotate(name, (x, y), xytext=(5, 5), textcoords='offset points', fontsize=9, fontweight='bold')

        ax.set_xlabel("Efficiency (Compression Ratio)", fontsize=11, fontweight='bold')
        ax.set_ylabel("Factual Reliability Score", fontsize=11, fontweight='bold')
        ax.set_title("Reliability vs. Efficiency Pareto Frontier", fontsize=12, fontweight='bold')
        ax.grid(True, linestyle='--', alpha=0.5)
        plt.savefig(os.path.join(self.output_dir, filename), dpi=150)
        plt.close(fig)

    def plot_perplexity_vs_factuality(self, ppls: List[float], facts: List[float], filename: str = "18_perplexity_factuality.png"):
        """Plot Perplexity vs Factuality scatter plot."""
        if len(ppls) < 2:
            return
        fig, ax = plt.subplots(figsize=(7, 4.5))
        ax.scatter(ppls, facts, color='#8b5cf6', s=80, edgecolors='#0f172a')
        ax.set_xlabel("Language Model Perplexity (PPL)", fontsize=11, fontweight='bold')
        ax.set_ylabel("Factual Correctness Ratio", fontsize=11, fontweight='bold')
        ax.set_title("The Perplexity Paradox: Perplexity vs. Factual Correctness", fontsize=12, fontweight='bold')
        ax.grid(True, linestyle='--', alpha=0.5)
        plt.savefig(os.path.join(self.output_dir, filename), dpi=150)
        plt.close(fig)
