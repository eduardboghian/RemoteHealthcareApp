const router = require('express').Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { User, registerValidation, loginValidation } = require('../models/user')

router.get('/getthem', async (req, res)=> {
    const users = await User.find()
    res.send(users)
})


router.post('/register', async (req, res) => {
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
        type: 'patient'
    })
    user = await user.save()

    res.send(user)
})

router.post('/login', async (req, res) => {
    const {error} = loginValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const user = await User.findOne({ email: req.body.email })
    if(!user) return res.status(400).send('Email or password is incorrect')

    const validPass = await bcrypt.compare(req.body.password, user.password)
    if(!validPass) return res.status(400).send('Email or password is incorrect')

    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET)
    res.header('auth-token', token)
})

module.exports = router