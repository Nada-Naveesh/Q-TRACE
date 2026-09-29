from collections import OrderedDict
import torch
import torch.nn as nn
from qtrace.repair import QuantizationRepair

def test_selective_repair_allocation():
    # Construct small test model with 10 linear layers
    layers = []
    for i in range(10):
        layers.append((f"layer_{i}", nn.Linear(16, 16)))
    model = nn.Sequential(OrderedDict(layers))

    mock_ranks = [{"layer": f"layer_{i}", "rank": i+1} for i in range(10)]

    # Repair top 20% (2 layers)
    alloc = QuantizationRepair.apply_selective_repair(
        model,
        sensitive_layer_ranks=mock_ranks,
        repair_fraction=0.20,
        target_precision="INT8"
    )

    assert alloc["repaired_layer_count"] == 2
    assert alloc["int4_layers_count"] == 8
    assert "layer_0" in alloc["repaired_layers"]
    assert "layer_1" in alloc["repaired_layers"]

if __name__ == "__main__":
    test_selective_repair_allocation()
    print("Repair unit tests passed successfully!")
