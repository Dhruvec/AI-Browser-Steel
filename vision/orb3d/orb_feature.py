import cv2

def detect_orb_features(image_path):

    image = cv2.imread(image_path)

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    orb = cv2.ORB_create()

    keypoints, descriptors = orb.detectAndCompute(gray, None)

    output = cv2.drawKeypoints(image, keypoints, None)

    return output