const cookieParser = require("cookie-parser")
const bodyParser =require('body-parser')
const path = require('path')
const dotenv = require('dotenv')
const cors = require('cors')
const mongoose = require('mongoose')
const express = require('express')
const app = express()

//IMPORT ROUTES

const authRoute = require('./routes/auth')

dotenv.config()
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(cors())


//Route Middlewere

app.use('/api/user', authRoute) 

// DB CONNECTION 

mongoose.connect(process.env.DB_CONNECT,  { useNewUrlParser: true }, console.log('db connected...'))


if (process.env.NODE_ENV === "production") {
    app.use(express.static('client/build'))
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    })
}

const PORT = process.env.PORT || 3001
app.listen(PORT, console.log(`connected to port ${PORT}...`))