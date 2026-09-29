import math
from typing import List, Dict, Any, Optional
import torch
import torch.nn as nn
from transformers import PreTrainedTokenizer
from scipy import stats

class ReliabilityEvaluator:
    """Evaluates consistency across repeats and analyzes Perplexity vs Factuality correlation."""

    @classmethod
    def compute_text_perplexity(
        cls,
        model: nn.Module,
        tokenizer: PreTrainedTokenizer,
        text: str,
        device: str = "cpu"
    ) -> float:
        """Calculate language model perplexity on text sample."""
        inputs = tokenizer(text, return_tensors="pt", truncation=True, max_length=256).to(device)
        input_ids = inputs["input_ids"]

        if input_ids.shape[1] < 2:
            return 10.0

        model.eval()
        with torch.no_grad():
            outputs = model(**inputs, labels=input_ids)
            loss = outputs.loss.item()
            ppl = math.exp(min(loss, 20.0))
        return float(ppl)

    @classmethod
    def evaluate_consistency(
        cls,
        model: nn.Module,
        tokenizer: PreTrainedTokenizer,
        prompt: str,
        n_repeats: int = 3,
        device: str = "cpu"
    ) -> Dict[str, Any]:
        """
        [PROJECT-DEFINED METRIC]
        Generate N responses and compute lexical and semantic consistency score.
        """
        if hasattr(tokenizer, "apply_chat_template") and tokenizer.chat_template:
            messages = [{"role": "user", "content": prompt}]
            formatted = tokenizer.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)
        else:
            formatted = f"Question: {prompt}\nAnswer:"

        inputs = tokenizer(formatted, return_tensors="pt").to(device)
        prompt_len = inputs["input_ids"].shape[1]

        outputs_text = []
        model.eval()
        with torch.no_grad():
            for i in range(n_repeats):
                # slight temperature for consistency sampling
                out = model.generate(
                    **inputs,
                    max_new_tokens=28,
                    do_sample=(i > 0),
                    temperature=0.3 if i > 0 else 0.0,
                    pad_token_id=tokenizer.pad_token_id or tokenizer.eos_token_id
                )
                text = tokenizer.decode(out[0, prompt_len:], skip_special_tokens=True).strip()
                outputs_text.append(text)

        # Pairwise word overlap agreement
        pairwise_agreements = []
        for i in range(len(outputs_text)):
            for j in range(i + 1, len(outputs_text)):
                s1 = set(outputs_text[i].lower().split())
                s2 = set(outputs_text[j].lower().split())
                if s1 and s2:
                    jaccard = len(s1.intersection(s2)) / len(s1.union(s2))
                    pairwise_agreements.append(jaccard)
                else:
                    pairwise_agreements.append(1.0 if s1 == s2 else 0.0)

        mean_consistency = float(sum(pairwise_agreements) / max(1, len(pairwise_agreements)))
        return {
            "consistency_score": mean_consistency,
            "sample_outputs": outputs_text,
            "n_repeats": n_repeats
        }

    @staticmethod
    def correlate_perplexity_vs_factuality(
        perplexities: List[float],
        accuracies: List[float]
    ) -> Dict[str, Any]:
        """
        Calculate Pearson and Spearman correlation between Perplexity and Factual Accuracy.
        Directly answers Research Question RQ9: Does perplexity adequately reflect factual reliability?
        """
        if len(perplexities) < 3 or len(accuracies) < 3:
            return {
                "pearson_r": 0.0,
                "pearson_p": 1.0,
                "spearman_rho": 0.0,
                "spearman_p": 1.0,
                "sample_size": len(perplexities),
                "conclusion": "Insufficient sample size to compute correlation."
            }

        p_r, p_p = stats.pearsonr(perplexities, accuracies)
        s_rho, s_p = stats.spearmanr(perplexities, accuracies)

        # Interpretation
        if abs(p_r) < 0.35:
            conclusion = "Perplexity exhibits weak correlation with factual reliability (The Perplexity Paradox confirmed)."
        elif p_r < -0.35:
            conclusion = "Perplexity demonstrates expected inverse relationship with factual accuracy."
        else:
            conclusion = "Perplexity unexpectedly correlates positively with error rates."

        return {
            "pearson_r": float(p_r),
            "pearson_p": float(p_p),
            "spearman_rho": float(s_rho),
            "spearman_p": float(s_p),
            "sample_size": len(perplexities),
            "conclusion": conclusion
        }
