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
const { Doctor } = require('./models/user')
const { Room } = require('./models/chat')
const multer  = require('multer')

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/')
  },

  filename: function(req, file, cb) {
    cb(null, file.originalname)
  } 
})

const fileFilter = (req, file, cb) => {
  if( file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' ) {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

const upload = multer({ storage: storage, fileFilter: fileFilter})

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
app.use('/uploads/', express.static('uploads'))
app.use(cookieParser())
app.use(cors())

//Route Middlewere

app.use('/api/user', authRoute) 
app.use('/api/chat', chatRoute)

// DB CONNECTION 

mongoose.connect(process.env.DB_CONNECT,  { useNewUrlParser: true }, console.log('db connected...'))

// UPLOAD PROFILE PICTURE

app.post('/api/profile/:id', upload.single('avatar'), async function (req, res, next) {
  console.log(req.file, req.params.id)

  let doc = await Doctor.findOneAndUpdate({_id: req.params.id}, { profilePic: req.file.path }, { new:true })

  res.send(doc)
})

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

let AccessToken = require('twilio').jwt.AccessToken
let VideoGrant = AccessToken.VideoGrant

app.get('/api/token/:name', function(request, response) {
  let identity = request.params.name

  // Create an access token which we will sign and return to the client, containing the grant we just created.

  let token = new AccessToken(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_API_KEY,
    process.env.TWILIO_API_SECRET
  )

  // Assign the generated identity to the token.
  token.identity = identity;

  // Grant the access token Twilio Video capabilities.
  let grant = new VideoGrant()
  token.addGrant(grant)

  // Serialize the token to a JWT string and include it in a JSON response.
  response.send({
    identity: identity,
    token: token.toJwt()
  })
})

// STRIPE IMPLEMENTATION

const stripe = require("stripe")("sk_test_ggCjI9rKE5AlDbdy2afR8SqG005pQTMGCn")
const uuid = require("uuid/v4")

app.post("/checkout", async (req, res) => {
  console.log("Request:", req.body);

  let error;
  let status;
  try {
    const { token } = req.body;

    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id
    });

    const idempotency_key = uuid();
    const price = 20
    const charge = await stripe.charges.create(
      {
        amount: price * 100,
        currency: "usd",
        customer: customer.id,
        receipt_email: token.email,
        description: `Purchased the service!`,
        shipping: {
          name: token.card.name,
          address: {
            line1: token.card.address_line1,
            line2: token.card.address_line2,
            city: token.card.address_city,
            country: token.card.address_country,
            postal_code: token.card.address_zip
          }
        }
      },
      {
        idempotency_key
      }
    );
    console.log("Charge:", { charge });
    status = "success";
  } catch (error) {
    console.error("Error:", error);
    status = "failure";
  }

  res.json({ error, status });
});



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

