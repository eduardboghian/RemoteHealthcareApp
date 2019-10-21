const mongooose = require('mongoose')
const Joi = require('joi')

const userSchema = new mongooose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    type: {
        type: String
    } 
})


const registerValidation = user => {
    const schema = {
        name: Joi.string().min(6).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(8).required()
    }
    return Joi.validate(user, schema)
}

const loginValidation = user => {
    const schema = {
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(8).required()
    }
    return Joi.validate(user, schema)
}

module.exports.loginValidation = loginValidation
module.exports.registerValidation = registerValidation
module.exports.User = mongooose.model('User', userSchema)