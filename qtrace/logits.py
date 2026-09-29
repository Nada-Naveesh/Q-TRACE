from typing import Dict, Any, List, Tuple
import torch
import torch.nn.functional as F

class LogitAnalyzer:
    """Analyzes logit divergence, KL divergence, Jensen-Shannon divergence, and top token rank shifts."""

    @staticmethod
    def compare_logits(
        logits_fp16: torch.Tensor,
        logits_quant: torch.Tensor
    ) -> Dict[str, Any]:
        """
        Compare last-token logits between FP16 and quantized models.
        Input tensors of shape [batch, vocab] or [vocab].
        """
        # Always select the final generated/evaluated token vector: shape [vocab_size]
        l_fp16 = logits_fp16.view(-1, logits_fp16.shape[-1])[-1].float()
        l_quant = logits_quant.view(-1, logits_quant.shape[-1])[-1].float()

        # Probabilities over vocabulary
        p = F.softmax(l_fp16, dim=-1)
        q = F.softmax(l_quant, dim=-1)

        # 1. KL Divergence: KL(P || Q)
        eps = 1e-12
        kl_div = float(torch.sum(p * (torch.log(p + eps) - torch.log(q + eps))).item())
        kl_div = max(0.0, kl_div)

        # 2. Jensen-Shannon Divergence
        m = 0.5 * (p + q)
        js_div = 0.5 * torch.sum(p * (torch.log(p + eps) - torch.log(m + eps))) + \
                 0.5 * torch.sum(q * (torch.log(q + eps) - torch.log(m + eps)))
        js_div = float(max(0.0, js_div.item()))

        # 3. Top-K Token overlap
        top1_p = int(torch.argmax(p).item())
        top1_q = int(torch.argmax(q).item())
        top1_changed = (top1_p != top1_q)

        top5_p = set(torch.topk(p, k=min(5, len(p))).indices.tolist())
        top5_q = set(torch.topk(q, k=min(5, len(q))).indices.tolist())
        top5_overlap = len(top5_p.intersection(top5_q)) / max(1, len(top5_p.union(top5_q)))

        top10_p = set(torch.topk(p, k=min(10, len(p))).indices.tolist())
        top10_q = set(torch.topk(q, k=min(10, len(q))).indices.tolist())
        top10_overlap = len(top10_p.intersection(top10_q)) / max(1, len(top10_p.union(top10_q)))

        # 4. Top-1 Probability Margin
        sorted_p, _ = torch.sort(p, descending=True)
        margin_p = float((sorted_p[0] - sorted_p[1]).item()) if len(sorted_p) > 1 else float(sorted_p[0].item())

        sorted_q, _ = torch.sort(q, descending=True)
        margin_q = float((sorted_q[0] - sorted_q[1]).item()) if len(sorted_q) > 1 else float(sorted_q[0].item())

        # 5. Shannon Entropy: H = -sum(p * log(p))
        entropy_p = float(-torch.sum(p * torch.log(p + eps)).item())
        entropy_q = float(-torch.sum(q * torch.log(q + eps)).item())

        return {
            "kl_divergence": kl_div,
            "js_divergence": js_div,
            "top1_changed": top1_changed,
            "top1_token_fp16": top1_p,
            "top1_token_quant": top1_q,
            "top5_overlap": float(top5_overlap),
            "top10_overlap": float(top10_overlap),
            "fp16_top_margin": margin_p,
            "quant_top_margin": margin_q,
            "fp16_entropy": entropy_p,
            "quant_entropy": entropy_q,
            "entropy_increase": entropy_q - entropy_p
        }
