from typing import Dict, Any, List, Tuple, Optional
import torch
import torch.nn as nn
from transformers import PreTrainedTokenizer

class RepresentationTracer:
    """Captures layer-wise hidden representations and computes representation drift and first divergence."""

    @classmethod
    def capture_hidden_states(
        cls,
        model: nn.Module,
        tokenizer: PreTrainedTokenizer,
        prompt: str,
        device: str = "cpu"
    ) -> Tuple[List[torch.Tensor], torch.Tensor]:
        """Run forward pass and return tuple of hidden states for each transformer layer and logits."""
        inputs = tokenizer(prompt, return_tensors="pt").to(device)
        model.eval()
        with torch.no_grad():
            outputs = model(**inputs, output_hidden_states=True)
            # Tuple of (layer_0_embedding, layer_1, ..., layer_N)
            hidden_states = [h.detach().cpu().float() for h in outputs.hidden_states]
            logits = outputs.logits.detach().cpu().float()
        return hidden_states, logits

    @classmethod
    def compute_layer_drift(
        cls,
        fp16_hidden_states: List[torch.Tensor],
        quant_hidden_states: List[torch.Tensor],
        divergence_threshold: float = 0.04
    ) -> Dict[str, Any]:
        """
        Compare intermediate representations across layers.
        Calculates cosine similarity, cosine distance (1 - cos), RMSE, and relative drift.
        Identifies the exact 'First Observed Divergence Layer'.
        """
        num_layers = min(len(fp16_hidden_states), len(quant_hidden_states))
        layer_drifts = []
        first_divergence_layer = None

        for idx in range(num_layers):
            h_fp16 = fp16_hidden_states[idx]
            h_quant = quant_hidden_states[idx]

            # Vector at final token position
            v_fp16 = h_fp16[0, -1, :]
            v_quant = h_quant[0, -1, :]

            # Cosine similarity
            norm_fp16 = torch.norm(v_fp16) + 1e-12
            norm_quant = torch.norm(v_quant) + 1e-12
            cos_sim = float((torch.dot(v_fp16, v_quant) / (norm_fp16 * norm_quant)).item())
            cos_dist = float(max(0.0, 1.0 - cos_sim))

            # RMSE
            rmse = float(torch.sqrt(torch.mean((v_fp16 - v_quant) ** 2)).item())
            rel_drift = float((torch.norm(v_fp16 - v_quant) / norm_fp16).item())

            layer_name = "Embedding" if idx == 0 else f"Layer_{idx}"
            layer_info = {
                "layer_index": idx,
                "layer_name": layer_name,
                "cosine_similarity": cos_sim,
                "cosine_distance": cos_dist,
                "rmse": rmse,
                "relative_drift": rel_drift
            }
            layer_drifts.append(layer_info)

            # Check for first observed persistent divergence
            if first_divergence_layer is None and idx > 0 and cos_dist >= divergence_threshold:
                first_divergence_layer = layer_name

        if first_divergence_layer is None and len(layer_drifts) > 1:
            # Fallback to layer with max divergence if threshold not met
            max_drift_layer = max(layer_drifts[1:], key=lambda x: x["cosine_distance"])
            first_divergence_layer = max_drift_layer["layer_name"]

        return {
            "layer_drifts": layer_drifts,
            "first_observed_divergence_layer": first_divergence_layer or "None",
            "mean_cosine_distance": float(sum(d["cosine_distance"] for d in layer_drifts) / max(1, len(layer_drifts))),
            "max_cosine_distance": float(max(d["cosine_distance"] for d in layer_drifts)) if layer_drifts else 0.0
        }
