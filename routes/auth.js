const router = require('express').Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { User, Doctor, registerValidation, loginValidation, docRegisterValidation } = require('../models/user')

router.get('/getdoctor/:id', async (req, res)=> {
    const docId = req.params.id
    const doc = await Doctor.find({_id:docId})
    res.send(doc)
})

router.post('/register/patient', async (req, res) => {
    const {error} = registerValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const check = await User.findOne({ email: req.body.email })
    if(check) return res.status(400).send('Email already registrated')

    const salt = await bcrypt.genSalt(10)
    const hashedPass = await bcrypt.hash(req.body.password, salt)

    let user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPass,
        type: 'patient',
        contactList: []  
    })
    user = await user.save()

    res.send(user)
})

router.post('/register/doctor', async (req, res) => {
    const {error} = docRegisterValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const check = await Doctor.findOne({ email: req.body.email })
    if(check) return res.status(400).send('Email already registrated')
    
    const salt = await bcrypt.genSalt(10)
    const hashedPass = await bcrypt.hash(req.body.password, salt)

    let doc = new Doctor({
        name: req.body.name,
        email: req.body.email,
        password: hashedPass,
        practiceNumber: req.body.practiceNumber,
        idCardNr: req.body.idCardNr,
        type: 'doctor',
        approved: false,
        contactList: []    
    })
    doc = await doc.save()

    res.send(doc)
})

router.post('/login/patient', async (req, res) => {
    const {error} = loginValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const user = await User.findOne({ email: req.body.email })
    if(!user) return res.status(400).send('Email or password is incorrect')

    const validPass = await bcrypt.compare(req.body.password, user.password)
    if(!validPass) return res.status(400).send('Email or password is incorrect')

    const token = jwt.sign({_id: user._id, name: user.name, email: user.email, contactList: user.contactList}, process.env.TOKEN_SECRET)
    res.header('authToken', token).send('logged in')
})

router.post('/login/doctor', async (req, res)=> {
    const {error} = loginValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const doc = await Doctor.findOne({ email: req.body.email })
    if(!doc) return res.status(400).send('Email or password is incorrect')

    const validPass = await bcrypt.compare(req.body.password, doc.password)
    if(!validPass) return res.status(400).send('Email or password is incorrect')

    if(! doc.approved ) return res.status(400).send('Your account was not approved yet!')

    const token = jwt.sign({_id: doc._id, name: doc.name, email: doc.email, contactList: user.contactList}, process.env.TOKEN_SECRET)
    res.header('authToken', token).send('logged in as doctor')

})

router.post('/getinfo', async (req, res)=> {
    const token = req.body.token
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET)
    res.send(decoded)
})

module.exports = router