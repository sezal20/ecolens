import os
import sys

# Add the backend directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from ai.huggingface_client import _is_valid_hf_api_key, generate_eco_explanation_hf

print("=" * 50)
print("Testing HuggingFace API Key Validation")
print("=" * 50)

# Test validation
is_valid = _is_valid_hf_api_key()
print(f"\nAPI Key Valid: {is_valid}")

# Test generate function (should return None gracefully if key is invalid)
print("\nTesting generate_eco_explanation_hf...")
result = generate_eco_explanation_hf("Test Product", "water, sugar")
print(f"Result: {result}")

print("\n" + "=" * 50)
print("Test Complete")
print("=" * 50)

