const express = require('express')
const app = express()
const serverr = require('http').createServer()
const mongoose = require('mongoose');
require('dotenv').config()
const Room = require('./models/Room')
const getWord = require('./api/getWord')

const PORT = process.env.PORT || 4000
const server = app.listen(PORT, () => {
    console.log(`server is started on ${PORT}`)
})

//middleware
app.use(express.json());

app.get('/', (req, res) => {
    res.send("Node Server is running. Yay!!!")
})

//connect to DB 
const DB = process.env.MONGO_DB; //Mongo db link

mongoose.connect(DB).then(() => {
    console.log('Connection Succesful')
}).catch((e) => {
    console.log(e)
})

const io = require('socket.io')(server)

io.on('connection', (socket) => {
    //console.log('connected to socketio')

    //Create game
    socket.on('create-game', async ({ nickname, name, occupancy, maxRounds }) => {
        //console.log('create-game')
        try {
            const existingRoom = await Room.findOne({ name })
            if (existingRoom) {
                socket.emit('notCorrectGame', 'Room with that name already exists!')
                return;
            }
            let room = new Room()
            const word = getWord()
            room.word = word
            room.name = name
            room.occupancy = occupancy
            room.maxRounds = maxRounds

            let player = {
                socketId: socket.id,
                nickname,
                isPartyLeader: true
            }
            room.players.push(player)
            room = await room.save()
            socket.join(name)
            // console.log("create game Room:" + room)
            // console.log('create game Name:' + name)
            io.to(name).emit('updateRoom', room)
        } catch (err) {
            console.log(`Error while creating room ${err}`)
        }
    })

    //join game
    socket.on('join-game', async ({ nickname, name }) => {
        //console.log('join-game')
        try {
            let room = await Room.findOne({ name })
            if (!room) {
                console.log('Room with that name is not exists!')
                socket.emit('notCorrectGame', 'Room with that name is not exists!')
                return
            }
            if (room.isJoin) {
                let player = {
                    socketId: socket.id,
                    nickname
                }
                room.players.push(player)
                socket.join(name)

                if (room.players.length === room.occupancy) {
                    room.isJoin = false
                }
                room.turn = room.players[room.turnIndex]
                room = await room.save()
                // console.log("join game Room:" + room)
                // console.log('join game Name:' + name)
                io.to(name).emit('updateRoom', room)
            } else {
                console.log('The game is in progress, please try later')
                socket.emit('notCorrectGame', 'The game is in progress, please try later')
            }
        } catch (err) {
            console.log(err)
        }
    })

    //chat socket
    socket.on('msg', async (data) => {
        try {
            if (data.msg === data.word) {
                let room = await Room.find({ name: data.roomName })
                let userPlayer = room[0].players.filter(
                    (player) => player.nickname === data.username
                )
                if (data.timeTaken !== 0) {
                    userPlayer[0].points += Math.round((200 / data.timeTaken) * 10)
                }
                room = await room[0].save()
                io.to(data.roomName).emit('msg', {
                    username: data.username,
                    msg: 'guessed it',
                    guessedUserCtr: data.guessedUserCtr + 1,
                })
            } else {
                io.to(data.roomName).emit('msg', {
                    username: data.username,
                    msg: data.msg,
                    guessedUserCtr: data.guessedUserCtr,
                })
            }

        } catch (err) {
            console.log(err.toString())
        }
    })

    socket.on('change-turn', async (name) => {
        try {
            let room = await Room.findOne({ name })
            let index = room.turnIndex;
            if (index + 1 == room.players.length) {
                room.currentRound += 1
            }
            if (room.currentRound <= room.maxRounds) {
                const word = getWord()
                room.word = word
                room.turnIndex = (index + 1) % room.players.length
                room.turn = room.players[room.turnIndex]
                room = await room.save()
                io.to(name).emit('change-turn', room)
            } else {
                //show the leaderboard
            }
        } catch (error) {
            console.log(err)
        }
    })

    // White board sockets
    socket.on('paint', ({ details, roomName }) => {
        io.to(roomName).emit('points', { details: details });
    })

    // Color socket
    socket.on('color-change', ({ color, roomName }) => {
        io.to(roomName).emit('color-change', color);
    })

    // Stroke Socket
    socket.on('stroke-width', ({ value, roomName }) => {
        io.to(roomName).emit('stroke-width', value)
    })

    // Clear screen
    socket.on('clean-screen', (roomName) => {
        io.to(roomName).emit('clear-screen', '')
    })
})