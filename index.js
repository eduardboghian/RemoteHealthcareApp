const cookieParser = require("cookie-parser")
const bodyParser =require('body-parser')
const path = require('path')
const dotenv = require('dotenv')
const cors = require('cors')
const mongoose = require('mongoose')
const express = require('express')
const app = express()
const http = require('http').createServer(app);
const io = require('socket.io')(http)
const { Patient, Doctor } = require('./models/user')
const { Messages } = require('./models/chat')

//IMPORT ROUTES

const authRoute = require('./routes/auth')
const chatRoute = require('./routes/chat')

dotenv.config()
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(cors())

//Route Middlewere

app.use('/api/user', authRoute) 
app.use('/api/chat', chatRoute)

// DB CONNECTION 

mongoose.connect(process.env.DB_CONNECT,  { useNewUrlParser: true }, console.log('db connected...'))

// SOKET.IO

io.on('connection', (socket) => {
  console.log('connected to socket...')

  socket.on('', ({ name }, callback) => {
  })

  socket.on('sendMessage', async (message) => {
    let msg = new Messages({
      name: 'edi',
      message: message
    })
    msg = await msg.save()

    io.emit('message', msg)
  })

  socket.on('disconnect', () => {
    console.log('disconnected...')
  })  
})

if (process.env.NODE_ENV === "production") {
    app.use(express.static('client/build'))
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    })
}

const PORT = process.env.PORT || 3001
http.listen(PORT, function(){
  console.log('listening on *:3001');
})

