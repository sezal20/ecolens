from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
import models


# 🔎 Get product by barcode
def get_product_by_barcode(db: Session, barcode: str):
    return db.query(models.Product).filter(
        models.Product.barcode == barcode
    ).first()



def get_all_history(db: Session, limit: int = 10):
    return db.query(models.Product).order_by(
        models.Product.id.desc()
    ).limit(limit).all()


# ➕ Create product (Safe + No duplicate barcode crash)
def create_product(db: Session, product_data: dict):
    """
    ALWAYS CREATE NEW for text/image scans.
    Only prevent duplicates if a REAL barcode exists.
    """

    
    # Use None instead of empty string to avoid UNIQUE constraint error
    barcode = product_data.get("barcode") or None
    name = product_data.get("name") or "Unknown Product"

    # ✅ Only check duplicates if barcode is real
    if barcode:
        existing = get_product_by_barcode(db, barcode)
        if existing:
            print(f"✅ Barcode exists: {existing.name}")
            return existing

    print(f"✅ Creating NEW: {name}")

    # Create DB object
    db_product = models.Product(
        name=name,
        barcode=barcode,  # None allowed
        materials=product_data.get("materials") or "",
        carbon_footprint=product_data.get("carbon_footprint") or 0.0,
        impact_score=product_data.get("impact_score") or 0,
        ai_description=product_data.get("ai_description") or ""
    )

    db.add(db_product)

    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise

    db.refresh(db_product)

    print(f"✅ SAVED: {db_product.name} (ID: {db_product.id})")

    return db_product
# 🔄 Create OR Get product (for text scans)
def create_or_get_product(db: Session, product_data: dict):
    """
    For text/image scans: check if similar product exists, else create new
    """
    name = product_data.get("name") or "Unknown Product"
    materials = product_data.get("materials") or ""
    
    # Check for exact match (name + materials)
    existing = db.query(models.Product).filter(
        models.Product.name == name,
        models.Product.materials == materials
    ).first()
    
    if existing:
        print(f"✅ Found existing: {name}")
        return existing
    
    # Create new (reuse your existing logic)
    print(f"✅ Creating NEW: {name}")
    return create_product(db, product_data)
# 🔄 Create OR Get product (for text scans - prevents duplicates)
def create_or_get_product(db: Session, product_data: dict):
    """
    For text/image scans: check if identical product exists, else create new.
    Matches on name + materials to avoid spam duplicates.
    """
    name = product_data.get("name") or "Unknown Product"
    materials = product_data.get("materials") or ""
    
    # 🔍 Check for exact duplicate (name + materials)
    existing = db.query(models.Product).filter(
        models.Product.name == name,
        models.Product.materials == materials
    ).first()
    
    if existing:
        print(f"✅ Found existing: {name} (ID: {existing.id})")
        return existing
    
    # ➕ Create new product
    print(f"✅ Creating NEW: {name}")
    return create_product(db, product_data)


# 🗑️ Delete product by ID
def delete_product(db: Session, product_id: int):
    """
    Delete a product from the database by its ID.
    Returns True if deleted, False if not found.
    """
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    
    if not product:
        print(f"❌ Product with ID {product_id} not found")
        return False
    
    db.delete(product)
    db.commit()
    print(f"✅ Deleted product: {product.name} (ID: {product_id})")
    return True
