const { Messages } = require('../models/chat')
const router = require('express').Router()

router.get('/messages', async (req, res)=> {
    const messages = await Messages.find()
    res.send(messages)
})

router.delete('/messages', async (req, res)=> {
    const msgs = await Messages.deleteMany()
    res.send(msgs)
})

module.exports = router