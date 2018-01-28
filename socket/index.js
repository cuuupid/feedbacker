var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 9119;
var clients = 0;

let serveFile = (f, s) => {
    s.sendFile(__dirname + f)
}

app.get('/', (q, s) => {
    serveFile('/deck.html', s)
})

app.get('/tracker', (q, s) => {
    serveFile('/tracker.html', s)
})

app.get('/chart.js', (q, s) => serveFile('/chart.js', s))

app.get('/style.css', (q, s) => {
    serveFile('/style.css', s)
})

app.get('/favicon.ico', (q, s) => {
    serveFile('/favicon.ico', s)
})

io.on('connection', (skt) => {
    skt.on('slide', (m) => {
        console.log("Slide switched")
        io.emit('slide', m)
    })
})

http.listen(port, () => {
    console.log('Listening on *:' + port)
})
