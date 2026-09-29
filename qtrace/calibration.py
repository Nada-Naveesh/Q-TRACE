from typing import List, Dict, Any, Optional
import torch
import torch.nn as nn
from transformers import PreTrainedTokenizer

class CalibrationManager:
    """Manages calibration datasets and hooks for capturing layer-wise activation statistics."""

    CALIBRATION_CORPUS = {
        "general_text": [
            "The solar system consists of the Sun and the objects that orbit it, including eight planets and numerous moons.",
            "Photosynthesis is a biological process used by plants and other organisms to convert light energy into chemical energy.",
            "The Industrial Revolution marked a major turning point in history; almost every aspect of daily life was influenced.",
            "An algorithm is a finite sequence of rigorous instructions, typically used to solve a class of specific problems.",
            "Water molecules consist of two hydrogen atoms bonded to a single oxygen atom via polar covalent bonds.",
            "The human nervous system coordinates actions and sensory information by transmitting signals across neuronal synapses.",
            "Geological tectonic plates float on the semi-fluid asthenosphere beneath Earth's crust, causing earthquakes and volcanoes.",
            "Thermodynamics governs the principles of heat, work, temperature, and their relations to energy and physical properties.",
            "DNA contains the genetic instructions necessary for the development, functioning, and reproduction of all known organisms.",
            "Classical mechanics describes the motion of macroscopic objects from projectiles to parts of machinery and astronomical bodies.",
            "Microbiology examines microscopic organisms such as bacteria, viruses, archaea, fungi and protozoa.",
            "The global economy encompasses all activities related to production, consumption, trade, and financial systems worldwide.",
            "Optical fibers transmit data as light pulses along strands of glass or plastic over long telecommunication distances.",
            "Quantum electrodynamics describes how light and matter interact, being the relativistic quantum field theory of electrodynamics.",
            "Renaissance literature and art revived classical antiquity philosophy, humanism, and proportion across Europe.",
            "Cellular respiration converts glucose into adenosine triphosphate (ATP) to power essential cellular functions."
        ],
        "factual_qa": [
            "Q: What is the primary function of chlorophyll? A: To absorb sunlight for photosynthesis.",
            "Q: Who formulated the three laws of motion? A: Sir Isaac Newton.",
            "Q: What is the largest ocean on Earth? A: The Pacific Ocean.",
            "Q: What gas is most abundant in Earth's atmosphere? A: Nitrogen makes up roughly 78 percent.",
            "Q: What is the unit of electrical resistance? A: The ohm.",
            "Q: Who proposed the heliocentric model of the solar system? A: Nicolaus Copernicus.",
            "Q: What is the hardest part of the human tooth? A: Enamel.",
            "Q: In what century did the Renaissance begin? A: The 14th century in Italy.",
            "Q: What is the atomic number of Carbon? A: Six.",
            "Q: What organ pumps blood through the circulatory system? A: The heart.",
            "Q: What type of galaxy is the Milky Way? A: A barred spiral galaxy.",
            "Q: What is the speed of sound in dry air at 20 degrees Celsius? A: Approximately 343 meters per second.",
            "Q: Who is known as the father of modern chemistry? A: Antoine Lavoisier.",
            "Q: What is the main component of natural gas? A: Methane.",
            "Q: What is the chemical formula for table salt? A: Sodium chloride, NaCl.",
            "Q: What force keeps planets in orbit around stars? A: Gravity."
        ],
        "mixed_domain": [
            "The Renaissance was a fervent period of European cultural, artistic, political and economic rebirth following the Middle Ages.",
            "Q: What is the chemical symbol for iron? A: Fe.",
            "Machine learning algorithms build mathematical models based on sample training data to make predictions or decisions.",
            "Q: What is the main function of red blood cells? A: Transporting oxygen throughout the body via hemoglobin.",
            "Renewable energy sources such as solar, wind, and hydroelectric power generate electricity with minimal carbon emissions.",
            "Q: What is the capital of Canada? A: Ottawa.",
            "The human brain contains approximately 86 billion neurons interconnected by trillions of synaptic connections.",
            "Q: What is the boiling point of ethanol? A: Approximately 78.37 degrees Celsius.",
            "Antibiotics are antimicrobial substances active against bacteria and are used in treating bacterial infections.",
            "Q: What is the closest star to Earth? A: The Sun.",
            "Semiconductor fabrication utilizes photolithography to pattern nanoscale transistors onto silicon wafers.",
            "Q: Who discovered the law of planetary motion? A: Johannes Kepler.",
            "Atmospheric pressure decreases with altitude because there is less air mass above higher elevations.",
            "Q: What is the deepest oceanic trench on Earth? A: The Mariana Trench.",
            "Genomics is an interdisciplinary field of biology focusing on the structure, function, and evolution of genomes.",
            "Q: What is the SI unit of force? A: The Newton."
        ]
    }

    @classmethod
    def get_calibration_texts(cls, source: str = "factual_qa", count: int = 16) -> List[str]:
        """Retrieve requested number of calibration samples from specified source."""
        corpus = cls.CALIBRATION_CORPUS.get(source, cls.CALIBRATION_CORPUS["factual_qa"])
        # If requested count exceeds base, cycle or pad safely
        result = []
        while len(result) < count:
            result.extend(corpus)
        return result[:count]

    @classmethod
    def collect_activation_statistics(
        cls,
        model: nn.Module,
        tokenizer: PreTrainedTokenizer,
        source: str = "factual_qa",
        sample_count: int = 16,
        device: str = "cpu"
    ) -> Dict[str, torch.Tensor]:
        """
        Run forward passes on calibration samples to extract maximum activation magnitude per channel
        for each nn.Linear layer. Used for activation-aware clipping and scaling.
        """
        texts = cls.get_calibration_texts(source, sample_count)
        act_scales: Dict[str, torch.Tensor] = {}
        hooks = []

        def make_hook(name: str):
            def hook_fn(module, input_tensor, output_tensor):
                if isinstance(input_tensor, tuple):
                    x = input_tensor[0]
                else:
                    x = input_tensor
                with torch.no_grad():
                    # Channel-wise max absolute activation across batch and sequence dimensions
                    flat_x = x.view(-1, x.shape[-1]).abs()
                    max_act = torch.amax(flat_x, dim=0).detach().cpu()
                    if name not in act_scales:
                        act_scales[name] = max_act
                    else:
                        act_scales[name] = torch.maximum(act_scales[name], max_act)
            return hook_fn

        # Register forward hooks on all linear layers
        for name, module in model.named_modules():
            if isinstance(module, nn.Linear):
                h = module.register_forward_hook(make_hook(name))
                hooks.append(h)

        # Execute calibration forward passes
        model.eval()
        with torch.no_grad():
            for text in texts:
                inputs = tokenizer(text, return_tensors="pt", truncation=True, max_length=128).to(device)
                model(**inputs)

        # Remove hooks
        for h in hooks:
            h.remove()

        return act_scales
