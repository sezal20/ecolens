import os
import json
import re
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def generate_eco_explanation(product_name: str, ingredients: str) -> str:
    """Plain text explanation — used as last resort fallback."""
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{
            "role": "user",
            "content": f"Give a 2-sentence environmental impact summary for: {product_name}. Materials: {ingredients[:300]}"
        }],
        max_tokens=150
    )
    return response.choices[0].message.content.strip()


def analyze_eco_impact_openai(product_name: str, materials: str) -> dict:
    """
    Returns structured dict with score, co2, explanation.
    Returns None on failure.
    """
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{
                "role": "system",
                "content": "You are an environmental scientist. Always respond with valid JSON only."
            }, {
                "role": "user", 
                "content": f"""Analyze the environmental impact of this product.
Product: {product_name}
Materials/Ingredients: {materials[:500]}

Respond with JSON only:
{{"score": <0-100, higher=greener>, "co2": <kg CO2 as float>, "explanation": "<2-3 sentence impact summary>"}}"""
            }],
            max_tokens=200
        )
        raw = response.choices[0].message.content.strip()
        match = re.search(r'\{.*?\}', raw, re.DOTALL)
        if match:
            data = json.loads(match.group())
            return {
                "score": float(data.get("score", 50)),
                "co2": float(data.get("co2", 0.5)),
                "explanation": data.get("explanation", "").strip()
            }
    except Exception as e:
        print(f"OpenAI structured error: {e}")
    return None