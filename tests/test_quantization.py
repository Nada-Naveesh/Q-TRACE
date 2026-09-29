import torch
import torch.nn as nn
from qtrace.quantization import QTraceQuantizer

def test_tensor_quantization_bounds():
    # Generate random test weight matrix
    torch.manual_seed(42)
    w = torch.randn(64, 64)

    # 4-bit quantization
    w_dequant, scale, metrics = QTraceQuantizer.quantize_tensor(
        w, bit_width=4, group_size=32, granularity="group-wise"
    )

    assert w_dequant.shape == w.shape
    assert metrics["rmse"] > 0.0
    assert metrics["rel_err"] > 0.0
    assert metrics["bit_width"] == 4
    # Dequantized weight should be close to original
    assert metrics["rmse"] < 1.0

def test_int8_vs_int4_error():
    torch.manual_seed(42)
    w = torch.randn(128, 128)

    _, _, m8 = QTraceQuantizer.quantize_tensor(w, bit_width=8, group_size=128)
    _, _, m4 = QTraceQuantizer.quantize_tensor(w, bit_width=4, group_size=128)

    # 8-bit quantization should have strictly lower reconstruction error than 4-bit
    assert m8["rmse"] < m4["rmse"]
    assert m8["rel_err"] < m4["rel_err"]

def test_model_in_place_quantization_and_restore():
    model = nn.Sequential(
        nn.Linear(32, 64),
        nn.ReLU(),
        nn.Linear(64, 16)
    )
    orig_w0 = model[0].weight.data.clone()

    # In-place quantization
    metrics = QTraceQuantizer.quantize_model_linear_layers(model, bit_width=4)
    assert len(metrics) == 2
    # Verify weights changed
    assert not torch.equal(model[0].weight.data, orig_w0)

    # Restore weights
    restored_count = QTraceQuantizer.restore_model_weights(model)
    assert restored_count == 2
    # Verify weights perfectly restored
    assert torch.equal(model[0].weight.data, orig_w0)

if __name__ == "__main__":
    test_tensor_quantization_bounds()
    test_int8_vs_int4_error()
    test_model_in_place_quantization_and_restore()
    print("All quantization unit tests passed successfully!")
