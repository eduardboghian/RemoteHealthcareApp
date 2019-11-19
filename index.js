const cookieParser = require("cookie-parser")
const bodyParser =require('body-parser')
const path = require('path')
const dotenv = require('dotenv')
const cors = require('cors')
const axios = require('axios')
const mongoose = require('mongoose')
const express = require('express')
const app = express()
const http = require('http').createServer(app);
const io = require('socket.io')(http)
const { Patient, Doctor } = require('./models/user')
const { Messages, Room } = require('./models/chat')

//IMPORT ROUTES

const authRoute = require('./routes/auth')
const chatRoute = require('./routes/chat')

dotenv.config()
app.use(express.json())
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "GET, POST");
  next();
});
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(cors())

//Route Middlewere

app.use('/api/user', authRoute) 
app.use('/api/chat', chatRoute)

// DB CONNECTION 

mongoose.connect(process.env.DB_CONNECT,  { useNewUrlParser: true }, console.log('db connected...'))

// SOKET.IO
const { addUser, removeUser, getUser, getUsersInRoom } = require('./users')

io.on('connect', (socket) => {
  socket.on('join', ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room })

    if(error) return callback(error)

    socket.join(user.room)

    io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) })

    callback()
  })

  socket.on('sendMessage', async (message, callback) => {
    const user = getUser(socket.id)

    const room = user.room
    const docId = room.slice(0, room.length/2)
    const patientId = room.slice(room.length/2, room.length)
    const msg = { user: user.name, text: message }

    let newMsg = await Room.findOneAndUpdate({ docId: docId, patientId: patientId },
      { $push: { messages: msg }},
      { new: true }
    )

    io.to(user.room).emit('message', { user: user.name, text: message })

    callback()
  })

  socket.on('disconnect', () => {
    const user = removeUser(socket.id)

    if(user) {
      io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left.` })
      io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)})
    }
  })
})

// WEBRTC VIDEO STREAMING


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

