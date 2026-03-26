import cv2

from vision.orb3d.orb_feature import detect_orb_features
from vision.orb3d.feature_match import match_features

print("Testing ORB Feature Detection")

img = detect_orb_features("test_images/image1.jpg")

cv2.imshow("ORB Features", img)
cv2.waitKey(0)

print("Testing Feature Matching")

match = match_features(
    "test_images/image1.jpg",
    "test_images/image2.jpg"
)

cv2.imshow("Feature Match", match)
cv2.waitKey(0)

cv2.destroyAllWindows()