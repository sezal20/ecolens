from fastapi import FastAPI, UploadFile, File, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import tempfile
import os
import cv2
import numpy as np
import crud, models, database, schemas, utils
from database import engine, get_db
from schemas import TextScan

# --------------------------------------------------
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="EcoScan API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------------------------------------
# Scan Barcode
@app.post("/scan-barcode", response_model=schemas.Product)
async def scan_barcode(
    file: UploadFile = File(...),
    db: Session = Depends(database.get_db)
):
    file_content = await file.read()
    img = cv2.imdecode(np.frombuffer(file_content, np.uint8), cv2.IMREAD_COLOR)
    if img is None:
        raise HTTPException(status_code=400, detail="Invalid image")

    # Step 1 — Try cv2 barcode detection
    barcode = utils.decode_barcode(img)
    print(f"CV2 barcode result: {barcode}")

    # Step 2 — If cv2 fails, use Groq Vision to READ the barcode number
    if not barcode:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp:
            tmp.write(file_content)
            path = tmp.name
        try:
            barcode = utils.read_barcode_with_groq(path)
            print(f"Groq barcode result: {barcode}")
        finally:
            os.unlink(path)

    # Step 3 — Look up barcode in OpenFoodFacts
    # Step 3 — Look up barcode in OpenFoodFacts
    if barcode:
        existing = crud.get_product_by_barcode(db, barcode)
        if existing:
            return existing

        data = utils.fetch_from_openfoodfacts(barcode)
        if data["name"] != "Unknown Product":
            ai_result = utils.analyze_product_with_ai(data["name"], data["materials"])
            return crud.create_product(db, {
                "name": data["name"],
                "barcode": barcode,
                "impact_score": ai_result["score"] or 0,
                "carbon_footprint": ai_result["co2"] or 0.0,
                "ai_description": ai_result["explanation"],
                "materials": data["materials"]
            })

        # ✅ Step 4 — Not in OpenFoodFacts, ask Groq by barcode number
        print(f"Not in OpenFoodFacts — asking Groq about barcode {barcode}...")
        groq_result = utils.analyze_product_by_barcode_groq(barcode)
        if groq_result:
            return crud.create_product(db, {
                "name": groq_result["name"],
                "barcode": barcode,
                "impact_score": groq_result["score"],
                "carbon_footprint": groq_result["co2"],
                "ai_description": groq_result["explanation"],
                "materials": groq_result["materials"]
            })

    # ✅ Step 5 — Last resort: Groq Vision on the image
    with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp:
        tmp.write(file_content)
        path = tmp.name
    try:
        print("Trying Groq Vision as last resort...")
        vision_result = utils.analyze_image_with_groq(path)
        if vision_result and vision_result["name"] not in ["Unknown Product", "Unknown"]:
            return crud.create_product(db, {
                "name": vision_result["name"],
                "barcode": barcode,
                "impact_score": vision_result["score"],
                "carbon_footprint": vision_result["co2"],
                "ai_description": vision_result["explanation"],
                "materials": vision_result["materials"]
            })
    finally:
        os.unlink(path)

    raise HTTPException(status_code=400, detail="Could not identify this product. Try scanning the product image instead.")

    
# --------------------------------------------------
# Analyze Image
@app.post("/analyze-image", response_model=schemas.Product)
async def analyze_image(
    file: UploadFile = File(...),
    db: Session = Depends(database.get_db)
):
    file_content = await file.read()

    with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp:
        tmp.write(file_content)
        path = tmp.name

    try:
        img = cv2.imdecode(np.frombuffer(file_content, np.uint8), cv2.IMREAD_COLOR)
        barcode = None

        if img is not None:
            barcode = utils.decode_barcode(img)

            if barcode:
                print(f"Barcode detected in image: {barcode}")
                data = utils.fetch_from_openfoodfacts(barcode)

                if data["name"] != "Unknown Product":
                    # ✅ Use unified AI, no hardcoded scoring
                    ai_result = utils.analyze_product_with_ai(data["name"], data["materials"])
                    score = ai_result["score"] or 0
                    co2 = ai_result["co2"] or 0.0
                    story = ai_result["explanation"]

                    return crud.create_product(db, {
                        "name": data["name"],
                        "barcode": barcode,
                        "impact_score": score,
                        "carbon_footprint": co2,
                        "ai_description": story,
                        "materials": data["materials"]
                    })

        # ✅ No barcode found — use Groq Vision to analyze image directly
        print("No barcode — using Groq Vision...")
        vision_result = utils.analyze_image_with_groq(path)

        if vision_result:
            print(f"Vision detected: {vision_result['name']} (score: {vision_result['score']})")
            return crud.create_product(db, {
                "name": vision_result["name"],
                "barcode": barcode,
                "impact_score": vision_result["score"],
                "carbon_footprint": vision_result["co2"],
                "ai_description": vision_result["explanation"],
                "materials": vision_result["materials"]
            })

        # ✅ Final fallback — OCR if vision also fails
        print("Vision failed — falling back to OCR...")
        text = utils.extract_text_from_image(path)
        product_name = utils.extract_product_name_from_text(text) or "Unknown Product"
        ai_result = utils.analyze_product_with_ai(product_name, text)

        return crud.create_product(db, {
            "name": product_name,
            "barcode": barcode,
            "impact_score": ai_result["score"] or 0,
            "carbon_footprint": ai_result["co2"] or 0.0,
            "ai_description": ai_result["explanation"],
            "materials": text or "No text detected"
        })

    finally:
        os.unlink(path)

# --------------------------------------------------
# Analyze Text
@app.post("/analyze-text", response_model=schemas.Product)
def analyze_text(payload: TextScan, db: Session = Depends(database.get_db)):
    text = payload.text.strip()

    if not text:
        raise HTTPException(status_code=400, detail="Text cannot be empty")

    product_name = utils.extract_product_name_from_text(text) or "Unknown Product"

    # ✅ Use unified AI (Groq → OpenAI fallback), no hardcoded scoring
    ai_result = utils.analyze_product_with_ai(product_name, text)
    score = ai_result["score"] or 0
    co2 = ai_result["co2"] or 0.0
    ai_description = ai_result["explanation"]

    product_data = {
        "name": product_name,
        "barcode": None,
        "materials": text,
        "carbon_footprint": co2,
        "impact_score": score,
        "ai_description": ai_description,
    }

    return crud.create_or_get_product(db, product_data)

# --------------------------------------------------
@app.get("/history", response_model=List[schemas.Product])
def history(db: Session = Depends(database.get_db)):
    return crud.get_all_history(db)

# 🗑️ Delete history item
@app.delete("/history/{item_id}")
def delete_history(item_id: int, db: Session = Depends(database.get_db)):
    success = crud.delete_product(db, item_id)
    if not success:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product deleted successfully"}

@app.get("/")
def health():
    return {"status": "EcoScan API ✅ Running Perfectly"}