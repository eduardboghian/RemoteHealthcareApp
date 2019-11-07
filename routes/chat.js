const { Messages, Room } = require('../models/chat')
const { User, Doctor } = require('../models/user')
const router = require('express').Router()

router.get('/messages', async (req, res)=> {
    const messages = await Messages.find()
    res.send(messages)
})

router.get('/find-room/:docId/:patientId', async (req, res)=>{
    let room = await Room.find({ docId: req.params.docId, patientId: req.params.patientId })

    res.send(room)
})

router.post('/create-room/:docId/:patientId', async (req, res)=>{
    let room = await Room.find({ docId: req.params.docId, patientId: req.params.patientId})
    console.log(room)
    if(room.length>0) return res.status(400).send('romm already exists...')

    room = new Room({ docId:req.params.docId, patientId:req.params.patientId, messages: [ ] })
    room = await room.save()
    console.log(room)
    res.send(room)
})

router.delete('/messages', async (req, res)=> {
    const msgs = await Messages.deleteMany()
    res.send(msgs)
})

module.exports = router