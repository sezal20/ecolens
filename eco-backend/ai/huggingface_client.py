import os
import re
import json
from groq import Groq

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def analyze_eco_impact_hf(product_name: str, materials: str) -> dict:
    """Uses Groq (free) instead of HuggingFace."""
    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",  # free, fast
            messages=[
                {
                    "role": "system",
                    "content": "You are an environmental scientist. Always respond with valid JSON only, no extra text."
                },
                {
                    "role": "user",
                    "content": f"""Analyze the environmental impact of this product.
Product: {product_name}
Materials: {materials[:300]}

Respond with JSON only:
{{"score": <0-100, higher=greener>, "co2": <kg CO2 as float>, "explanation": "<2-3 sentence impact summary>"}}"""
                }
            ],
            max_tokens=200,
            temperature=0.3
        )

        raw = response.choices[0].message.content.strip()
        print(f"Groq response: {raw[:200]}")

        match = re.search(r'\{[^{}]*\}', raw, re.DOTALL)
        if match:
            data = json.loads(match.group())
            return {
                "score": float(data.get("score", 50)),
                "co2": float(data.get("co2", 0.5)),
                "explanation": str(data.get("explanation", "")).strip()
            }

    except Exception as e:
        print(f"Groq error: {e}")

    return None


def generate_eco_explanation_hf(product_name: str, ingredients: str) -> str:
    result = analyze_eco_impact_hf(product_name, ingredients)
    return result.get("explanation") if result else None