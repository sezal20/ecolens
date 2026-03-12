import os
import requests
from dotenv import load_dotenv
import cv2
import numpy as np
import pytesseract

load_dotenv()

# --------------------------------------------------
# UNIFIED AI ANALYSIS — HuggingFace first, OpenAI fallback
# NO hardcoded scoring
# --------------------------------------------------
def analyze_product_with_ai(product_name: str, materials: str) -> dict:
    """
    Returns {"score": float, "co2": float, "explanation": str}
    Tries HuggingFace first, then OpenAI, then gives honest minimal fallback.
    """
    from ai.huggingface_client import analyze_eco_impact_hf
    from ai.openai_client import analyze_eco_impact_openai

    # 1. Try HuggingFace
    result = analyze_eco_impact_hf(product_name, materials)
    if result and result.get("explanation"):
        print("✅ Used HuggingFace for analysis")
        return result

    # 2. Try OpenAI
    result = analyze_eco_impact_openai(product_name, materials)
    if result and result.get("explanation"):
        print("✅ Used OpenAI for analysis")
        return result

    # 3. Honest fallback — no fake demo data
    print("⚠️ Both AI providers failed — returning honest fallback")
    return {
        "score": None,   # None = unknown, not fake 50
        "co2": None,
        "explanation": f"Could not analyze {product_name} automatically. Please check your AI API keys."
    }


# --------------------------------------------------
# OpenFoodFacts
# --------------------------------------------------
def fetch_from_openfoodfacts(barcode: str) -> dict:
    url = f"https://world.openfoodfacts.org/api/v0/product/{barcode}.json"
    try:
        r = requests.get(url, timeout=10)
        data = r.json()
        if data.get("status") == 1:
            product = data["product"]
            name = product.get("product_name") or product.get("brands") or "Unknown Product"
            materials = (
                product.get("ingredients_text")
                or product.get("categories")
                or ""
            )
            return {"name": name, "materials": materials, "found": True}
    except Exception as e:
        print("OFF error:", e)
    return {"name": "Unknown Product", "materials": "", "found": False}


# --------------------------------------------------
# Barcode Detection — with explicit method logging
# --------------------------------------------------
def decode_barcode(img):
    try:
        if img is None:
            return None

        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

        # 1. QR Code
        qr = cv2.QRCodeDetector()
        decoded, points, _ = qr.detectAndDecode(gray)
        if decoded and decoded.strip():
            print(f"✅ QR detected: {decoded.strip()}")
            return decoded.strip()

        # 2. OpenCV BarcodeDetector (contrib only)
        try:
            detector = cv2.barcode.BarcodeDetector()
            ret, decoded_info, _, _ = detector.detectAndDecodeMulti(gray)
            if ret and decoded_info:
                for d in decoded_info:
                    if d and d.strip():
                        print(f"✅ CV2 barcode detected: {d.strip()}")
                        return d.strip()
        except AttributeError:
            print("⚠️ cv2.barcode not available (need opencv-contrib-python)")
        except Exception as e:
            print(f"CV2 barcode error: {e}")

        # 3. pyzbar fallback
        print("⚠️ Skipping pyzbar — using Groq Vision instead")

    except Exception as e:
        print(f"Barcode decode error: {e}")
        return None


# --------------------------------------------------
# OCR
# --------------------------------------------------
def extract_text_from_image(image_path: str) -> str:
    tesseract_paths = [
        r"C:\Program Files\Tesseract-OCR\tesseract.exe",
        r"C:\Program Files (x86)\Tesseract-OCR\tesseract.exe",
        "/usr/bin/tesseract",
        "/usr/local/bin/tesseract",
    ]
    for path in tesseract_paths:
        if os.path.exists(path):
            pytesseract.pytesseract.tesseract_cmd = path
            break

    try:
        img = cv2.imread(image_path)
        if img is None:
            return ""
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        blurred = cv2.GaussianBlur(gray, (5, 5), 0)
        _, thresh = cv2.threshold(blurred, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        text = pytesseract.image_to_string(thresh).strip()
        if not text:
            text = pytesseract.image_to_string(gray).strip()
        print(f"OCR result (first 100): {text[:100]}")
        return text
    except Exception as e:
        print(f"OCR error: {e}")
        return ""


# --------------------------------------------------
# Product Name Extraction
# --------------------------------------------------
def extract_product_name_from_text(text: str) -> str:
    if not text or len(text.strip()) < 3:
        return "Unknown Product"
    stop_words = {
        "i", "use", "using", "my", "this", "that", "is", "are",
        "a", "an", "the", "with", "made", "of", "for", "and", "to"
    }
    words = text.lower().split()
    product_words = [w for w in words if w not in stop_words and len(w) > 2]
    if len(product_words) >= 2:
        name = " ".join(product_words[:3]).title()
        return name if 3 < len(name) < 40 else "Unknown Product"
    elif product_words:
        return product_words[0].title()
    return "Unknown Product"


# --------------------------------------------------
# REMOVED: calculate_ai_impact() and get_ai_description()
# These were the source of hardcoded/demo data.
# Use analyze_product_with_ai() instead.
# --------------------------------------------------

# ADD this new function to utils.py
def analyze_image_with_groq(image_path: str) -> dict:
    """
    Uses Groq vision to directly analyze product image.
    Returns {"name": str, "materials": str, "score": float, "co2": float, "explanation": str}
    """
    import base64
    import json
    import re
    from groq import Groq
    import os

    client = Groq(api_key=os.getenv("GROQ_API_KEY"))

    try:
        with open(image_path, "rb") as f:
            image_data = base64.b64encode(f.read()).decode("utf-8")

        # Detect image type
        ext = image_path.lower().split(".")[-1]
        media_type = "image/jpeg" if ext in ["jpg", "jpeg"] else "image/png"

        response = client.chat.completions.create(
            model="meta-llama/llama-4-scout-17b-16e-instruct",  # vision model
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:{media_type};base64,{image_data}"
                            }
                        },
                        {
                            "type": "text",
                            "text": """Analyze this product image for environmental impact.
Identify the product name, materials/ingredients visible, and assess eco impact.

Respond with JSON only:
{"name": "<product name>", "materials": "<visible materials or ingredients>", "score": <0-100 higher=greener>, "co2": <kg CO2 float>, "explanation": "<2-3 sentence environmental impact>"}"""
                        }
                    ]
                }
            ],
            max_tokens=300
        )

        raw = response.choices[0].message.content.strip()
        print(f"Vision response: {raw[:200]}")

        match = re.search(r'\{[^{}]*\}', raw, re.DOTALL)
        if match:
            data = json.loads(match.group())
            return {
                "name": str(data.get("name", "Unknown Product")),
                "materials": str(data.get("materials", "")),
                "score": float(data.get("score", 50)),
                "co2": float(data.get("co2", 0.5)),
                "explanation": str(data.get("explanation", ""))
            }

    except Exception as e:
        print(f"Vision error: {e}")

    return None

def read_barcode_with_groq(image_path: str) -> str:
    """
    Uses Groq Vision to read barcode NUMBER from image.
    Returns the barcode string or None.
    """
    import base64
    from groq import Groq

    client = Groq(api_key=os.getenv("GROQ_API_KEY"))

    try:
        with open(image_path, "rb") as f:
            image_data = base64.b64encode(f.read()).decode("utf-8")

        ext = image_path.lower().split(".")[-1]
        media_type = "image/png" if ext == "png" else "image/jpeg"

        response = client.chat.completions.create(
            model="meta-llama/llama-4-scout-17b-16e-instruct",
            messages=[{
                "role": "user",
                "content": [
                    {
                        "type": "image_url",
                        "image_url": {"url": f"data:{media_type};base64,{image_data}"}
                    },
                    {
                        "type": "text",
                        "text": "Read the barcode or QR code number in this image. Reply with ONLY the number, nothing else. If no barcode is visible, reply with: NONE"
                    }
                ]
            }],
            max_tokens=50
        )

        result = response.choices[0].message.content.strip()
        print(f"Groq barcode read: {result}")

        if result and result != "NONE" and len(result) >= 8:
            # Clean up — keep only digits
            digits = ''.join(filter(str.isdigit, result))
            if len(digits) >= 8:
                return digits

    except Exception as e:
        print(f"Groq barcode read error: {e}")

    return None

def analyze_product_by_barcode_groq(barcode: str) -> dict:
    import json, re
    from groq import Groq

    client = Groq(api_key=os.getenv("GROQ_API_KEY"))

    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {
                    "role": "system",
                    "content": "You are a product database expert. Respond with JSON only. Never return Unknown - always make your best guess based on the barcode region code."
                },
                {
                    "role": "user",
                    "content": f"""Analyze barcode {barcode}.

The first digits tell us the country:
- 890 = India
- 544 = Belgium  
- 500 = UK
- 400-440 = Germany
- 300-379 = France
- 000-019 = USA

Based on the barcode number {barcode}, make your best guess about:
1. What type of product this might be
2. Which country it's from
3. Estimated environmental impact

Respond with JSON only:
{{"name": "<best guess product name>", "materials": "<likely materials>", "score": <0-100>, "co2": <float>, "explanation": "<2-3 sentence eco impact based on likely product type and origin>"}}"""
                }
            ],
            max_tokens=200,
            temperature=0.3
        )

        raw = response.choices[0].message.content.strip()
        print(f"Barcode lookup response: {raw[:150]}")

        match = re.search(r'\{.*?\}', raw, re.DOTALL)
        if match:
            data = json.loads(match.group())
            return {
                "name": str(data.get("name", "Unknown Product")),
                "materials": str(data.get("materials", "")),
                "score": float(data.get("score", 50)),
                "co2": float(data.get("co2", 0.5)),
                "explanation": str(data.get("explanation", ""))
            }
    except Exception as e:
        print(f"Barcode lookup error: {e}")

    return None