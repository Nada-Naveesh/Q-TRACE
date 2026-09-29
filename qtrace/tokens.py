import re
import difflib
from typing import Dict, Any, List, Set, Tuple

class TokenAnalyzer:
    """Analyzes token-level drift, substitutions, and critical factual token stability."""

    YEAR_PATTERN = re.compile(r'\b(1[0-9]{3}|20[0-9]{2})\b')
    NUMBER_PATTERN = re.compile(r'\b\d+(\.\d+)?%?\b')
    PROPER_NOUN_PATTERN = re.compile(r'\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b')
    SCIENTIFIC_TERMS = {
        "penicillin", "photoelectric", "relativity", "mitochondria", "dna", "rna",
        "photosynthesis", "jupiter", "mars", "atp", "au", "co2", "h2o", "gravity",
        "electron", "proton", "neutron", "chlorophyll", "nitrogen", "oxygen"
    }

    @classmethod
    def extract_critical_tokens(cls, text: str) -> List[str]:
        """Extract entities, dates, numbers, and scientific terms from text."""
        critical = []
        # Years & Numbers
        for m in cls.YEAR_PATTERN.finditer(text):
            critical.append(m.group())
        for m in cls.NUMBER_PATTERN.finditer(text):
            if m.group() not in critical:
                critical.append(m.group())

        # Proper Nouns (Entities)
        for m in cls.PROPER_NOUN_PATTERN.finditer(text):
            val = m.group()
            if val.lower() not in {"the", "a", "an", "in", "on", "at", "by", "for", "with"}:
                critical.append(val)

        # Scientific Terms
        words = re.findall(r'\b[a-zA-Z0-9_]+\b', text.lower())
        for w in words:
            if w in cls.SCIENTIFIC_TERMS and w not in [c.lower() for c in critical]:
                critical.append(w)

        return critical

    @classmethod
    def compare_token_sequences(
        cls,
        text_fp16: str,
        text_quant: str
    ) -> Dict[str, Any]:
        """
        Compare token/word sequences between FP16 and Quantized answers.
        Computes changed words, insertions, deletions, substitutions, and Critical Token Stability.
        """
        words_fp16 = text_fp16.strip().split()
        words_quant = text_quant.strip().split()

        matcher = difflib.SequenceMatcher(None, words_fp16, words_quant)
        changed_blocks = []
        substituted_pairs = []
        deleted_tokens = []
        inserted_tokens = []

        for tag, i1, i2, j1, j2 in matcher.get_opcodes():
            if tag == 'replace':
                changed_blocks.append({
                    "type": "substitution",
                    "fp16": " ".join(words_fp16[i1:i2]),
                    "quant": " ".join(words_quant[j1:j2])
                })
                substituted_pairs.append((" ".join(words_fp16[i1:i2]), " ".join(words_quant[j1:j2])))
            elif tag == 'delete':
                changed_blocks.append({
                    "type": "deletion",
                    "fp16": " ".join(words_fp16[i1:i2]),
                    "quant": ""
                })
                deleted_tokens.extend(words_fp16[i1:i2])
            elif tag == 'insert':
                changed_blocks.append({
                    "type": "insertion",
                    "fp16": "",
                    "quant": " ".join(words_quant[j1:j2])
                })
                inserted_tokens.extend(words_quant[j1:j2])

        # Compute Critical Token Stability (Project-defined metric)
        critical_fp16 = cls.extract_critical_tokens(text_fp16)
        if not critical_fp16:
            cts = 1.0 if text_fp16.strip() == text_quant.strip() else 0.8
            preserved_critical = []
            lost_critical = []
        else:
            quant_lower = text_quant.lower()
            preserved_critical = [c for c in critical_fp16 if c.lower() in quant_lower]
            lost_critical = [c for c in critical_fp16 if c.lower() not in quant_lower]
            cts = float(len(preserved_critical) / len(critical_fp16))

        # Overall token overlap (Jaccard)
        set_fp16 = set(w.lower() for w in words_fp16)
        set_quant = set(w.lower() for w in words_quant)
        token_overlap = len(set_fp16.intersection(set_quant)) / max(1, len(set_fp16.union(set_quant)))

        return {
            "critical_token_stability": cts,
            "token_overlap": float(token_overlap),
            "total_critical_tokens_fp16": len(critical_fp16),
            "preserved_critical_tokens": preserved_critical,
            "lost_critical_tokens": lost_critical,
            "substitution_count": len(substituted_pairs),
            "deletion_count": len(deleted_tokens),
            "insertion_count": len(inserted_tokens),
            "substituted_pairs": substituted_pairs,
            "has_critical_drift": len(lost_critical) > 0
        }
