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
    },
    contactList: {
        type: Array
    } 
})

const docSchema = new mongooose.Schema({
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
    practiceNumber: {
        type: String,
        required: true,
    },
    idCardNr: {
        type: String,
        required: true,
    },
    type: {
        type: String
    },
    approved: {
        type: Boolean
    },
    contactList: {
        type: Array
    },
    rating: {
        type: Number
    },
    raters: {
        type: Number
    },  
    profilePic: {
        type: String
    },
    degree: {
        type: String
    },
    departament: {
        type: String
    },
    profileInfo: {
        type: Array
    }  
})


const docRegisterValidation = user => {
    const schema = {
        name: Joi.string().min(6).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(8).required(),
        idCardNr: Joi.string().min(6).required(),
        practiceNumber: Joi.string().min(6).required(),
    }
    return Joi.validate(user, schema)
}

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

module.exports.docRegisterValidation = docRegisterValidation
module.exports.loginValidation = loginValidation
module.exports.registerValidation = registerValidation
module.exports.User = mongooose.model('User', userSchema)
module.exports.Doctor = mongooose.model('Doctor', docSchema)