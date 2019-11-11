const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    }
})

const roomSchema = new mongoose.Schema({
    docId: {
        type: String,
        required: true
    },
    patientId: {
        type: String,
        required: true
    },
    messages: {
        type: Array
    }   
})

module.exports.Messages = mongoose.model('Messages', messageSchema)
module.exports.Room = mongoose.model('Room', roomSchema)