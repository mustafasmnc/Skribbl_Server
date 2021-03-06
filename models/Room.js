const mongoose = require('mongoose');
const { playerSchema } = require('./Player')

const roomSchema = new mongoose.Schema({
    word: {
        required: true,
        type: String
    },
    name: {
        required: true,
        type: String,
        unique: true,
        trim: true
    },
    occupancy: {
        required: true,
        type: Number,
        default: 4
    },
    maxRounds: {
        required: true,
        type: Number
    },
    currentRound: {
        required: true,
        type: Number,
        default: 1
    },
    level: {
        required: true,
        type: String
    },
    players: [playerSchema],
    isJoin: {
        type: Boolean,
        default: true
    },
    turn: playerSchema,
    turnIndex: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const gameModel = mongoose.model('Room', roomSchema)
module.exports = gameModel