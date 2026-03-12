from sqlalchemy import Column, Integer, String, Float
from database import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)

    barcode = Column(String, nullable=True)

    impact_score = Column(Float, default=0.0)

    carbon_footprint = Column(Float, default=0.0)

    ai_description = Column(String, default="")

    materials = Column(String, default="")
