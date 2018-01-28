from sanic import Sanic, response
import requests
import base64
from sanic_cors import CORS, cross_origin
import re

app = Sanic()
CORS(app)

@app.route('/nlp', methods=['POST', 'OPTIONS'])
async def nlp(request):
    token = request.json['token']
    l = requests.post('http://192.81.214.158:6666/postmortem', json={'token': token})
    d = l.json()
    feedbacks = d['data']
    scores = {
        'bored': 0,
        'interested': 0,
        'confusion': 0,
        'understanding': 0
    }
    for feedback in feedbacks:
        sentences = re.split(r' *[\.\?!][\'"\)\]]* *', feedback)
        for sentence in sentences:
            r = requests.post('192.81.214.158:8008/parse', json={'q': sentence})
            s = r.json()
            for d in s['intent_ranking']:
                scores[d['name']] += scores[d['confidence']]
    response.json(scores)            

app.run(host='0.0.0.0', port=7474)