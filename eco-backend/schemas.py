from pydantic import BaseModel
from typing import Optional


# -------- INPUT SCHEMA (For Text Scan) --------
class TextScan(BaseModel):
    text: str
    
    model_config = {  # ✅ ADD THIS
        "json_schema_extra": {
            "example": {"text": "bamboo toothbrush with natural bristles"}
        }
    }


# -------- BASE PRODUCT --------
class ProductBase(BaseModel):
    name: str
    impact_score: float
    carbon_footprint: float
    ai_description: str
    materials: str


# -------- CREATE --------
class ProductCreate(ProductBase):
    barcode: Optional[str] = None   # ✅ Use None (not empty string)


# -------- RESPONSE --------
class Product(ProductBase):
    id: int
    barcode: Optional[str] = None   # ✅ IMPORTANT FIX

    model_config = {
        "from_attributes": True
    }
