const express = require("express");
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {cors: "*"});

app.get('/', (req, res) => {
    res.json({asd: "hellasdo"})
});

io.on('connection', (socket) => {
    socket.on('sendmessage', ({message, user}) => {
        io.emit('sendmessage', {message, user});
    })

    socket.on('connected', (nickname) => {
        io.emit('connected', nickname);
    })

    socket.on('disconnect', (reason) => {
        io.emit('disconnected', socket.id);
    })
})

server.listen(5000, () => {
    console.log('listenin on 5000')
});