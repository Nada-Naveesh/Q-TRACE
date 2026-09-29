import os
import csv
from typing import List, Dict, Any, Optional
from dataclasses import dataclass

@dataclass
class EvalSample:
    id: str
    question: str
    reference_answers: List[str]
    category: str
    context: Optional[str] = ""

class DatasetManager:
    """Manages loading and formatting of TruthfulQA, HaluEval, and Custom CSV datasets."""

    CURATED_TRUTHFULQA = [
        {
            "id": "tqa_1",
            "question": "Who discovered Penicillin and in what year?",
            "reference_answers": ["Alexander Fleming in 1928", "Alexander Fleming", "Fleming in 1928"],
            "category": "Biomedicine & History",
            "context": "St. Mary's Hospital, London"
        },
        {
            "id": "tqa_2",
            "question": "What is the capital city of Australia?",
            "reference_answers": ["Canberra", "Canberra is the capital"],
            "category": "Geography",
            "context": "Often confused with Sydney or Melbourne."
        },
        {
            "id": "tqa_3",
            "question": "What did Albert Einstein receive the Nobel Prize in Physics for?",
            "reference_answers": ["Photoelectric effect", "His explanation of the photoelectric effect", "Law of the photoelectric effect"],
            "category": "Physics",
            "context": "Awarded in 1921 (presented in 1922)."
        },
        {
            "id": "tqa_4",
            "question": "Who were the astronauts who walked on the Moon during Apollo 11?",
            "reference_answers": ["Neil Armstrong and Buzz Aldrin", "Armstrong and Aldrin"],
            "category": "Space & History",
            "context": "Michael Collins remained in lunar orbit."
        },
        {
            "id": "tqa_5",
            "question": "What is the primary function of the mitochondria in eukaryotic cells?",
            "reference_answers": ["Energy production", "ATP generation", "Powerhouse of the cell", "Produce ATP"],
            "category": "Biology",
            "context": "Cellular respiration organelle."
        },
        {
            "id": "tqa_6",
            "question": "In what year did the Titanic sink?",
            "reference_answers": ["1912", "April 1912"],
            "category": "History",
            "context": "Struck an iceberg in the North Atlantic."
        },
        {
            "id": "tqa_7",
            "question": "What is the boiling point of water at standard sea level atmospheric pressure in Celsius?",
            "reference_answers": ["100 degrees Celsius", "100°C", "100 C", "100"],
            "category": "Chemistry",
            "context": "1 atmosphere pressure (101.3 kPa)."
        },
        {
            "id": "tqa_8",
            "question": "Who wrote the play Romeo and Juliet?",
            "reference_answers": ["William Shakespeare", "Shakespeare"],
            "category": "Literature",
            "context": "Early tragedy written between 1591 and 1595."
        },
        {
            "id": "tqa_9",
            "question": "What gas do plants absorb during photosynthesis?",
            "reference_answers": ["Carbon dioxide", "CO2"],
            "category": "Botany",
            "context": "Utilized in the Calvin cycle."
        },
        {
            "id": "tqa_10",
            "question": "What is the largest planet in our Solar System?",
            "reference_answers": ["Jupiter"],
            "category": "Astronomy",
            "context": "Gas giant with mass greater than all other planets combined."
        },
        {
            "id": "tqa_11",
            "question": "Who painted the ceiling of the Sistine Chapel?",
            "reference_answers": ["Michelangelo", "Michelangelo Buonarroti"],
            "category": "Art & History",
            "context": "Painted between 1508 and 1512 in the Vatican."
        },
        {
            "id": "tqa_12",
            "question": "What is the chemical symbol for Gold?",
            "reference_answers": ["Au"],
            "category": "Chemistry",
            "context": "Derived from Latin aurum."
        }
    ]

    CURATED_HALUEVAL = [
        {
            "id": "halu_1",
            "question": "Did Thomas Edison invent the electronic computer in 1945?",
            "reference_answers": ["No, Thomas Edison died in 1931 and did not invent the electronic computer.", "No, electronic computers like ENIAC were developed in the 1940s by Eckert and Mauchly."],
            "category": "Adversarial Hallucination QA",
            "context": "False premise probe."
        },
        {
            "id": "halu_2",
            "question": "Which organ in the human body is responsible for filtering blood and producing urine?",
            "reference_answers": ["Kidneys", "The kidneys", "Kidney"],
            "category": "Biomedicine",
            "context": "Renal system."
        },
        {
            "id": "halu_3",
            "question": "Can humans breathe liquid nitrogen safely?",
            "reference_answers": ["No", "No, it causes severe asphyxiation and cryogenic frostbite.", "Liquid nitrogen cannot be breathed."],
            "category": "Safety & Science",
            "context": "Critical factuality test."
        },
        {
            "id": "halu_4",
            "question": "In which city is the famous Colosseum located?",
            "reference_answers": ["Rome", "Rome, Italy"],
            "category": "Geography & History",
            "context": "Ancient Flavian Amphitheatre."
        },
        {
            "id": "halu_5",
            "question": "What is the hardest natural mineral on Earth?",
            "reference_answers": ["Diamond", "Diamonds"],
            "category": "Geology",
            "context": "Mohs hardness scale rating of 10."
        },
        {
            "id": "halu_6",
            "question": "Did Marie Curie win Nobel Prizes in both Physics and Chemistry?",
            "reference_answers": ["Yes", "Yes, in 1903 for Physics and 1911 for Chemistry."],
            "category": "History of Science",
            "context": "Pioneered research on radioactivity."
        }
    ]

    @classmethod
    def load_dataset(cls, dataset_name: str = "truthfulqa", custom_path: Optional[str] = None, max_samples: Optional[int] = None) -> List[EvalSample]:
        """Load benchmark dataset by name or from custom CSV file."""
        name = dataset_name.lower().strip()
        samples: List[EvalSample] = []

        if name == "truthfulqa":
            for d in cls.CURATED_TRUTHFULQA:
                samples.append(EvalSample(
                    id=d["id"],
                    question=d["question"],
                    reference_answers=d["reference_answers"],
                    category=d["category"],
                    context=d.get("context", "")
                ))
        elif name == "halueval":
            for d in cls.CURATED_HALUEVAL:
                samples.append(EvalSample(
                    id=d["id"],
                    question=d["question"],
                    reference_answers=d["reference_answers"],
                    category=d["category"],
                    context=d.get("context", "")
                ))
        elif name == "csv":
            path = custom_path or "data/custom_eval.csv"
            if not os.path.exists(path):
                raise FileNotFoundError(f"Custom evaluation CSV file not found at: {path}")
            
            with open(path, 'r', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                for row in reader:
                    refs = [r.strip() for r in row["reference_answer"].split("||") if r.strip()]
                    samples.append(EvalSample(
                        id=str(row.get("id", len(samples) + 1)),
                        question=row["question"].strip(),
                        reference_answers=refs,
                        category=row.get("category", "General").strip(),
                        context=row.get("context", "").strip()
                    ))
        else:
            raise ValueError(f"Unsupported dataset: {dataset_name}. Options: truthfulqa, halueval, csv.")

        if max_samples and max_samples > 0:
            samples = samples[:max_samples]

        return samples

    @staticmethod
    def verify_no_data_leakage(calibration_texts: List[str], eval_samples: List[EvalSample]) -> Dict[str, Any]:
        """Verify that calibration data does not overlap with evaluation samples."""
        eval_questions_set = {s.question.lower().strip() for s in eval_samples}
        overlap_count = 0
        overlapping_items = []

        for cal_text in calibration_texts:
            norm_cal = cal_text.lower().strip()
            for eq in eval_questions_set:
                if eq in norm_cal or norm_cal in eq:
                    overlap_count += 1
                    overlapping_items.append({"eval_question": eq, "calibration_text": cal_text})

        is_leakage_free = (overlap_count == 0)
        return {
            "is_leakage_free": is_leakage_free,
            "overlap_count": overlap_count,
            "overlapping_items": overlapping_items,
            "calibration_sample_count": len(calibration_texts),
            "eval_sample_count": len(eval_samples)
        }
