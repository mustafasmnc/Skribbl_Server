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
            var roomCreatedData = existingRoom['createdAt']
            roomCreatedData.setHours(roomCreatedData.getHours() + 1)
            var currentDateTime = new Date()
            if (currentDateTime > roomCreatedData) {
                console.log('currentDateTime greater than roomCreatedData')
                const deleteRoom = await Room.deleteOne({ existingRoom });
                console.log(deleteRoom)
                if (deleteRoom['deletedCount'] == 1) {
                    //we send 404 because we deleted the room
                    res.status(404).json({ success: false, msg: 'room not exist' })
                } else {
                    res.status(200).json({ success: true, msg: 'room is exist' })
                }
            }
            else {
                console.log('currentDateTime less than roomCreatedData')
                if (existingRoom['isJoin'] == true) {
                    res.status(200).json({ success: true, msg: 'room is exist' })
                } else {
                    res.status(202).json({ success: true, msg: 'room is exist, but full' })
                }
            }

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