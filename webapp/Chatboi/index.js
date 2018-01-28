var MongoClient = require('mongodb').MongoClient
var express = require('express')
app = express()
var bodyparser = require('body-parser')
app.use(bodyparser.json())

function error (e, s) {
  console.log("An error occurred.")
  console.log(e)
  s.sendStatus(402)
  return true
}

app.post('/feedback', (q, s) => {
  if (!q.body.token) return error('No token!', s)
  if (!q.body.feedback) return error('No feedback!', s)
  MongoClient.connect('mongodb://localhost:27017/', (e, qb) => {
    let db = qb.db('LectureFeedback')
    if (e) return error(e, s)
    else {
      let c = db.collection(q.body.token)
      c.insert({ feedback: q.body.feedback })
      s.sendStatus(200)
    }
  })
})


app.post('/realtime', (q, s) => {
  if (!q.body.frameId || !q.body.scores || !q.body.token) return error('Missing frame scores or token', s)
  MongoClient.connect('mongodb://localhost:27017/LectureRealtime', (e, qb) => {
    let db = qb.db('LectureRealtime')
    if (e) return error(e, s)
    else {
      let c = db.collection(q.body.token)
      c.insert({ frameId: q.body.frameId, scores: q.body.scores })
      s.sendStatus(200)
    }
  })
})

app.post('/feed', (q, s) => {
  if (!q.body.token) return error('No token!', s)
  else if (!q.body.frameId) return error('No frameId!', s)
  else MongoClient.connect('mongodb://localhost:27017/', (e, qb) => {
    let db = qb.db('LectureRealtime')
    if (e) return error(e, s)
    else {
      let c = db.collection(q.body.token)
      c.find({ frameId: { $gt: q.body.frameId } }).toArray((e3, i) => {
        if (e3) return error(e3, s)
        else s.send(i)
      })
    }
  })
})

app.post('/improve', (q, s) => {
  if (!q.body.token) return error('No token!', s)
  else MongoClient.connect('mongodb://localhost:27017/', (e, qb) => {
    if (e) return error(e, s)
    else {
      let db = qb.db('LectureFeedback')
      let c = db.collection(q.body.token)
      c.find().toArray((e3, i) => {
        if (e3) return error(e3, s)
        else s.send(i)
      })
    }
  })
})

app.listen(6666, () => console.log('Listening on 6666'))
