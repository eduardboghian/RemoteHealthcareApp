const { Messages, Room } = require('../models/chat')
const { User, Doctor } = require('../models/user')
const router = require('express').Router()

router.get('/load-messages/:did/:pid', async (req, res)=>{
    let room = await Room.find({ docId: req.params.did, patientId: req.params.pid })

    res.send(room)
})

// CREATE AND UPDATE ROOM

router.post('/create-room/:docId/:patientId', async (req, res)=>{
    let room = await Room.find({ docId: req.params.docId, patientId: req.params.patientId})
    if(room.length>0) return res.status(200).send('romm already exists...')

    room = new Room({ docId:req.params.docId, patientId:req.params.patientId, messages: [ ] })
    room = await room.save()
    res.send(room)
})

// []

router.put('/newmsg/:room', async (req, res) => {
    const room = req.params.room
    const docId = room.slice(0, room.length/2)
    const patientId = room.slice(room.length/2, room.length)
    const msg = { user: req.body.name, text: req.body.message }
    
    
    let messages = await Room.findOneAndUpdate({ docId: docId, patientId: patientId },
        { $push: { messages: msg }},
        { new: true }
    ) 

    res.send( messages )
})

// UPDATE CONTACT LIST

router.put('/add-contact/:did/:pid', async (req, res)=> {       
    console.log(req.params.pid, req.params.did)

    const patientContacts = await User.find({_id:req.params.pid ,contactList: req.params.did})
    const docContacts = await Doctor.find({contactList: req.params.pid})

    console.log(patientContacts)

    if(patientContacts.length<1) {
        const p = await User.findOneAndUpdate({_id: req.params.pid}, {$push: {contactList: req.params.did}},{ new: true }) 
        const d = await Doctor.findOneAndUpdate({_id: req.params.did}, {$push: {contactList: req.params.pid}},{ new: true })  
        return res.status(200).send('stored...', p, d)
    }
    res.status(200).send('already stored...')
})

// DELETE ALL MESSAGES **REMOVE THIS CODE

router.delete('/messages', async (req, res)=> {
    const msgs = await Messages.deleteMany()
    res.send(msgs)
})


// REVIEWS

router.get('/getreviews', async (req, res)=> {
    const reviews = await Messages.find()
    res.send(reviews)
})

router.post('/addreview', async (req, res)=> {
    let review = new Messages({
        userId: req.body.userId,
        message: req.body.message,
        name: req.body.name
    })
    review = await review.save()

    res.send(review)
})

module.exports = router