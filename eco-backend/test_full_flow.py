import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from utils import analyze_product_with_ai

print("=" * 60)
print("Testing Full AI Analysis Flow")
print("=" * 60)

result = analyze_product_with_ai("Coca Cola", "water, sugar, caffeine")

print("\nResult:")
print(result)

print("\n" + "=" * 60)
print("Test Complete")
print("=" * 60)

