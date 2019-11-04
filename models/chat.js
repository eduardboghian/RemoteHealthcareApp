const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },

})

module.exports.Messages = mongoose.model('Messages', messageSchema)