import os, json, sys

filenames = os.listdir('./data')

fin = []

for filename in filenames:
    try:
        if filename.split('.')[-1] != 'json':
            continue
        with open('./data/' + filename, 'rb') as f:
            d = json.load(f)
        for dat in d['rasa_nlu_data']['common_examples']:
            fin.append(dat)
    except Exception as e:
        print('%s: %s' % (filename, e))
d = {
    'rasa_nlu_data': {
        'common_examples': fin
    }
}

with open('data.json', 'w') as f:
    json.dump(d, f)