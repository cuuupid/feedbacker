import numpy as np
import cv2
import requests
import base64
from time import time as t
import json

cap = cv2.VideoCapture(0)

s = t()

THRESHOLD = 0.01

while(True):
    res = {
        "anger": 0, "contempt": 0, "disgust": 0, "fear": 0, "happiness": 0, "neutral": 0, "sadness": 0, "surprise": 0
    }
    _, img = cap.read()
    _, frame = cv2.imencode('.jpg', img)
    frame = base64.b64encode(frame)
    frame = base64.decodebytes(frame)
    r = requests.post('https://westus.api.cognitive.microsoft.com/emotion/v1.0/recognize', data=frame, headers={
                      'Content-type': 'application/octet-stream', 'Ocp-Apim-Subscription-Key': 'KEY HERE'})
    data = r.json()
    cv2.imwrite('tmp/input.jpg', img)
    try:
        with open('tmp/result.json', 'w') as f:
            json.dump(data, f)
        d = [entry["scores"].items() for entry in data]
        for scores in d:
            for cat, score in scores:
                res[cat] += score
        for cat, score in res.items():
            if score > THRESHOLD:
                print("%s    (%f)" % (cat, score))
        print("-"* 25)
    except Exception as e:
        print(e)
        pass
    while t() - s < 5:
        1 + 1

# When everything done, release the capture
cap.release()
cv2.destroyAllWindows()
