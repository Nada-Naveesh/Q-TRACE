import time
from typing import Dict, Any, Tuple, List, Optional
import torch
import torch.nn as nn
from transformers import PreTrainedTokenizer

class TextGenerator:
    """Performs controlled autoregressive generation while tracking token probabilities, confidence, and entropy."""

    @classmethod
    def generate_response(
        cls,
        model: nn.Module,
        tokenizer: PreTrainedTokenizer,
        prompt: str,
        max_new_tokens: int = 36,
        device: str = "cpu"
    ) -> Dict[str, Any]:
        """
        Run deterministic greedy generation and track generation telemetry:
        generated text, latency, tokens per second, mean probability, min probability, entropy.
        """
        # Format prompt cleanly
        if hasattr(tokenizer, "apply_chat_template") and tokenizer.chat_template:
            messages = [{"role": "user", "content": prompt}]
            formatted_prompt = tokenizer.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)
        else:
            formatted_prompt = f"Question: {prompt}\nAnswer:"

        inputs = tokenizer(formatted_prompt, return_tensors="pt").to(device)
        input_ids = inputs["input_ids"]
        prompt_len = input_ids.shape[1]

        model.eval()
        start_time = time.perf_counter()

        with torch.no_grad():
            outputs = model.generate(
                **inputs,
                max_new_tokens=max_new_tokens,
                do_sample=False, # Deterministic greedy decoding for reproducibility
                return_dict_in_generate=True,
                output_scores=True,
                pad_token_id=tokenizer.pad_token_id or tokenizer.eos_token_id
            )

        elapsed_time = time.perf_counter() - start_time
        gen_tokens = outputs.sequences[0, prompt_len:]
        num_gen_tokens = len(gen_tokens)
        tok_per_sec = num_gen_tokens / max(1e-5, elapsed_time)

        # Decode generated text
        full_text = tokenizer.decode(outputs.sequences[0], skip_special_tokens=True)
        gen_text = tokenizer.decode(gen_tokens, skip_special_tokens=True).strip()

        # Clean prefix if model repeated question
        if "Answer:" in gen_text:
            gen_text = gen_text.split("Answer:")[-1].strip()

        # Compute confidence and entropy from generation scores
        token_probs = []
        token_entropies = []
        eps = 1e-12

        if outputs.scores:
            for score in outputs.scores:
                probs = torch.softmax(score[0].float(), dim=-1)
                top_p = float(torch.max(probs).item())
                entropy = float(-torch.sum(probs * torch.log(probs + eps)).item())
                token_probs.append(top_p)
                token_entropies.append(entropy)

        mean_prob = float(sum(token_probs) / max(1, len(token_probs))) if token_probs else 0.85
        min_prob = float(min(token_probs)) if token_probs else 0.50
        mean_entropy = float(sum(token_entropies) / max(1, len(token_entropies))) if token_entropies else 0.50

        return {
            "prompt": prompt,
            "generated_text": gen_text,
            "full_output": full_text,
            "latency_seconds": elapsed_time,
            "num_tokens": num_gen_tokens,
            "tokens_per_second": tok_per_sec,
            "mean_token_confidence": mean_prob,
            "min_token_confidence": min_prob,
            "mean_token_entropy": mean_entropy
        }
