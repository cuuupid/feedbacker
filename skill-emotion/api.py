from sanic import Sanic, response
import requests
import base64

app = Sanic()

@app.route("/emotion", methods=['POST'])
async def test(request):
    img_data = request.body
    img_data = img_data[img_data.index(',') + 1:]
    r = requests.post('https://westus.api.cognitive.microsoft.com/emotion/v1.0/recognize', data=base64.decodebytes(img_data), headers={'Content-type': 'application/octet-stream', 'Ocp-Apim-Subscription-Key': '59c23938459842c59c82f594ebce1072'})
    data = r.json()
    try:
        d = [entry["scores"].items() for entry in data]
        for scores in d:
            for cat, score in scores:
                res[cat] += score
        final = dict()
        for cat, score in res.items():
            if score > THRESHOLD:
                final[cat] = score
        return response.json(final)
    except Exception as e:
        return response.json({'error': e})
        pass

app.run(host='0.0.0.0', port=1337)