import cv2
from pyzbar.pyzbar import decode

img = cv2.imread("test_barcode.png")
codes = decode(img)

print(codes)
