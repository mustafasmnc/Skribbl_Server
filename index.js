const express = require('express');
var http = require('http');
const app = express();
const port = process.env.PORT || 3000;
var server = http.createServer(app);
const mongoose = require('mongoose');

// var socket=require('socket.io');
// var io=socket(server);
var io = require('socket.io')(server);

//middleware
app.use(express.json());

app.get('/', (req, res) => {
    res.send("Node Server is running. Yay!!")
})

//connect to DB 
const DB = 'mongodb+srv://smnc:smnc@cluster0.3ft7a.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

mongoose.connect(DB).then(() => {
    console.log('Connection Succesful')
}).catch((e) => {
    console.log(e)
})

const socketio = require('socket.io')(http)

socketio.on("connection", (userSocket) => {
    console.log('a user is connected')
    userSocket.on("send_message", (data) => {
        userSocket.broadcast.emit("receive_message", data)
    })
})

// io.on('connection', function (socket) {
//     console.log(socket.id, 'joined');
//     socket.on('/test', function (msg) {
//         console.log(msg);
//     });
// });

app.listen(port, "0.0.0.0", () => {
    console.log(`Server running at ${port}`)
})