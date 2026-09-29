import re
from typing import Dict, Any, List, Optional
from qtrace.tokens import TokenAnalyzer

class HallucinationDetector:
    """Detects factual failures, classifies error taxonomy, and flags quantization-associated degradations."""

    TAXONOMY_CATEGORIES = [
        "factual entity substitution",
        "fabricated entity",
        "numerical error",
        "date/temporal error",
        "false-premise acceptance",
        "unsupported claim",
        "contradiction",
        "semantic drift",
        "incomplete answer",
        "overconfident incorrect answer"
    ]

    @staticmethod
    def evaluate_correctness(generated_text: str, reference_answers: List[str]) -> TupleBoolScore:
        """
        Evaluate factual agreement between generated text and reference ground truth.
        Returns (is_correct, score).
        """
        gen_clean = generated_text.lower().strip()
        if not gen_clean:
            return False, 0.0

        for ref in reference_answers:
            ref_clean = ref.lower().strip()
            # 1. Substring match
            if ref_clean in gen_clean:
                return True, 1.0

            # 2. Token overlap F1
            gen_tokens = set(re.findall(r'\b[a-zA-Z0-9]+\b', gen_clean))
            ref_tokens = set(re.findall(r'\b[a-zA-Z0-9]+\b', ref_clean))
            if not ref_tokens:
                continue

            intersection = gen_tokens.intersection(ref_tokens)
            recall = len(intersection) / len(ref_tokens)
            precision = len(intersection) / max(1, len(gen_tokens))
            f1 = (2 * precision * recall) / (precision + recall) if (precision + recall) > 0 else 0.0

            # If recall is high (contains all key ground truth tokens)
            if recall >= 0.85 or f1 >= 0.70:
                return True, float(max(recall, f1))

        # Check partial agreement
        max_f1 = 0.0
        for ref in reference_answers:
            ref_tokens = set(re.findall(r'\b[a-zA-Z0-9]+\b', ref.lower().strip()))
            gen_tokens = set(re.findall(r'\b[a-zA-Z0-9]+\b', gen_clean))
            if ref_tokens:
                inter = gen_tokens.intersection(ref_tokens)
                p = len(inter) / max(1, len(gen_tokens))
                r = len(inter) / len(ref_tokens)
                f = (2 * p * r) / (p + r) if (p + r) > 0 else 0.0
                if f > max_f1:
                    max_f1 = f

        return False, float(max_f1)

    @classmethod
    def classify_failure_type(
        cls,
        text_fp16: str,
        text_quant: str,
        reference_answers: List[str],
        confidence_quant: float
    ) -> str:
        """Classify observable failure into structured research taxonomy."""
        quant_lower = text_quant.lower()

        # Check for overconfident error
        if confidence_quant >= 0.85:
            # Overconfident check
            return "overconfident incorrect answer"

        # Check for date / temporal error
        years_ref = []
        for r in reference_answers:
            years_ref.extend(TokenAnalyzer.YEAR_PATTERN.findall(r))
        years_quant = TokenAnalyzer.YEAR_PATTERN.findall(text_quant)

        if years_ref and years_quant and set(years_ref) != set(years_quant):
            return "date/temporal error"

        # Check for numerical error
        nums_ref = []
        for r in reference_answers:
            nums_ref.extend(TokenAnalyzer.NUMBER_PATTERN.findall(r))
        nums_quant = TokenAnalyzer.NUMBER_PATTERN.findall(text_quant)
        if nums_ref and nums_quant and set(nums_ref) != set(nums_quant):
            return "numerical error"

        # Check for entity substitution
        entities_fp16 = TokenAnalyzer.PROPER_NOUN_PATTERN.findall(text_fp16)
        entities_quant = TokenAnalyzer.PROPER_NOUN_PATTERN.findall(text_quant)
        if entities_fp16 and entities_quant and set(entities_fp16) != set(entities_quant):
            return "factual entity substitution"

        if len(text_quant.split()) < 3:
            return "incomplete answer"

        return "semantic drift"

    @classmethod
    def analyze_quantization_failure(
        cls,
        sample_id: str,
        question: str,
        reference_answers: List[str],
        text_fp16: str,
        text_quant: str,
        confidence_fp16: float,
        confidence_quant: float
    ) -> Dict[str, Any]:
        """
        Determines whether a failure is a genuine QUANTIZATION-ASSOCIATED FAILURE
        (FP16 correct, Quantized incorrect).
        """
        fp16_correct, fp16_score = cls.evaluate_correctness(text_fp16, reference_answers)
        quant_correct, quant_score = cls.evaluate_correctness(text_quant, reference_answers)

        # Mark Quantization-Associated Failure
        is_quant_failure = (fp16_correct and not quant_correct)
        
        failure_type = "None"
        if not quant_correct:
            failure_type = cls.classify_failure_type(
                text_fp16, text_quant, reference_answers, confidence_quant
            )

        return {
            "sample_id": sample_id,
            "question": question,
            "reference": " || ".join(reference_answers),
            "fp16_text": text_fp16,
            "quant_text": text_quant,
            "fp16_correct": fp16_correct,
            "quant_correct": quant_correct,
            "fp16_score": fp16_score,
            "quant_score": quant_score,
            "is_quantization_associated_failure": is_quant_failure,
            "failure_taxonomy": failure_type,
            "is_wrong_and_high_confidence": (not quant_correct and confidence_quant >= 0.85)
        }

TupleBoolScore = tuple[bool, float]
