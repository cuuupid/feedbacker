from sanic import Sanic, response
import requests
import base64
from sanic_cors import CORS, cross_origin

app = Sanic()
CORS(app)


@app.route('/emotion', methods=['POST', 'OPTIONS'])
async def test(request):
    print("Trying")
    img_data = request.json['data'].encode('utf-8')
    print(str(img_data[:10]))
    print("Made it")
    r = requests.post('https://westus.api.cognitive.microsoft.com/emotion/v1.0/recognize', data=base64.decodebytes(img_data),
                      headers={'Content-type': 'application/octet-stream', 'Ocp-Apim-Subscription-Key': 'KEY HERE'})
    r2 = requests.post('https://southcentralus.api.cognitive.microsoft.com/customvision/v1.1/Prediction/5de2f554-fa68-43f4-ab9f-f6234ba26596/image?iterationId=0dd2c33f-5347-45ac-8783-afe5ecae010c',
                       data=base64.decodebytes(img_data), headers={'Content-Type': 'application/octet-stream', 'Prediction-Key': 'KEY HERE'})
    data = r.json()
    data2 = r2.json()
    try:
        d = [entry["scores"].items() for entry in data]
        num = len(d)
        res = dict()
        for scores in d:
            for cat, score in scores:
                if cat not in res:
                    res[cat] = 0
                res[cat] += score
        final = dict()
        for cat, score in res.items():
            if score > 0.01:
                final[cat] = score
        final['top2'] = sorted(final, key=(lambda key: -final[key]))[:2]
        final['size'] = num
        final['applause'] = data2
        return response.json(final)
    except Exception as e:
        return response.json({'error': e})
        pass

app.run(host='0.0.0.0', port=1337)
