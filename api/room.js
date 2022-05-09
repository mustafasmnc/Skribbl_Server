const express = require('express')
const router = express.Router()
const Room = require('../models/Room')

router.post('/check', async (req, res) => {
    try {
        var roomName = req.body.roomName
        //console.log(req.body.roomName)
        const existingRoom = await Room.findOne({ name: roomName })
        //console.log(existingRoom)
        if (existingRoom) {
            res.status(200).json({ success: true, msg: 'room is exist' })
        } else {
            res.status(404).json({ success: false, msg: 'room not exist' })
            //return;
        }

    } catch (err) {
        res.status(400).json({ success: false, msg: error })
    }
})


router.post('/delete', async (req, res) => {
    try {
        var roomName = req.body.roomName
        //console.log(req.body.roomName)
        const existingRoom = await Room.findOne({ name: roomName })
        //console.log(existingRoom)
        if (existingRoom) {

            const deleteRoom = await Room.deleteOne({ name: roomName });
            //console.log(deleteRoom)
            if (deleteRoom['deletedCount'] == 1) {
                res.status(200).json({ success: true, msg: 'room deleted' })
            } else {
                res.status(409).json({ success: false, msg: 'room not deleted' })
            }

            //return;
        } else {
            res.status(404).json({ success: false, msg: 'room not exist' })
            //return;
        }

    } catch (err) {
        res.status(400).json({ success: false, msg: error })
    }
})

module.exports = router