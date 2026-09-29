from typing import Dict, Any, List, Tuple
import numpy as np

class StatisticalAnalyzer:
    """Computes distribution statistics, bootstrap confidence intervals, and paired significance tests."""

    @staticmethod
    def compute_summary_stats(values: List[float]) -> Dict[str, float]:
        """Compute basic statistical aggregations: mean, median, std, min, max."""
        if not values:
            return {"mean": 0.0, "median": 0.0, "std": 0.0, "min": 0.0, "max": 0.0}

        arr = np.array(values, dtype=float)
        return {
            "mean": float(np.mean(arr)),
            "median": float(np.median(arr)),
            "std": float(np.std(arr)),
            "min": float(np.min(arr)),
            "max": float(np.max(arr))
        }

    @staticmethod
    def bootstrap_ci(
        values: List[float],
        n_bootstraps: int = 1000,
        ci: float = 0.95,
        seed: int = 42
    ) -> Tuple[float, float]:
        """
        Compute non-parametric 95% bootstrap confidence interval for the sample mean.
        """
        if len(values) < 2:
            val = values[0] if values else 0.0
            return val, val

        rng = np.random.default_rng(seed)
        arr = np.array(values, dtype=float)
        boot_means = []

        for _ in range(n_bootstraps):
            sample = rng.choice(arr, size=len(arr), replace=True)
            boot_means.append(np.mean(sample))

        alpha = (1.0 - ci) / 2.0
        lower = float(np.percentile(boot_means, alpha * 100))
        upper = float(np.percentile(boot_means, (1.0 - alpha) * 100))

        return lower, upper

    @staticmethod
    def paired_difference_test(
        baseline_scores: List[float],
        treatment_scores: List[float]
    ) -> Dict[str, Any]:
        """Compute paired delta, mean difference, and bootstrap CI of the difference."""
        n = min(len(baseline_scores), len(treatment_scores))
        if n < 2:
            return {"mean_diff": 0.0, "ci_lower": 0.0, "ci_upper": 0.0, "sample_size": n}

        diffs = [treatment_scores[i] - baseline_scores[i] for i in range(n)]
        mean_diff = float(np.mean(diffs))
        lower, upper = StatisticalAnalyzer.bootstrap_ci(diffs)

        return {
            "mean_difference": mean_diff,
            "ci_95_lower": lower,
            "ci_95_upper": upper,
            "sample_size": n,
            "significant_at_95": not (lower <= 0.0 <= upper)
        }
