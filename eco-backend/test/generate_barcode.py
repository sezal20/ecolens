from barcode import EAN13
from barcode.writer import ImageWriter

# Valid EAN-13 barcode
number = "8901491100128"

barcode = EAN13(number, writer=ImageWriter())
filename = barcode.save("real_barcode")

print("Generated barcode:", filename)
