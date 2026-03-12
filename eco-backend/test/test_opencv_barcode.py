import cv2

img = cv2.imread("real_barcode.png")

# Convert to grayscale
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

# Resize UP (this is the key)
h, w = gray.shape
gray = cv2.resize(gray, (w * 4, h * 4), interpolation=cv2.INTER_CUBIC)

detector = cv2.barcode.BarcodeDetector()
decoded_info, decoded_type, points = detector.detectAndDecode(gray)

print("Decoded info:", decoded_info)
print("Decoded type:", decoded_type)
print("Points:", points)
