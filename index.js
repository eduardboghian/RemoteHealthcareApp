const cookieParser = require("cookie-parser")
const path = require('path')
const express = require('express')
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

if (process.env.NODE_ENV === "production") {
    app.use(express.static('client/build'))
    app.get("*", (req, res) => {
      res.sendFile(path.reslve(__dirname, 'client', 'build', 'index.html'));
    })
}

const PORT = process.env.PORT || 3001
app.listen(PORT, console.log(`connected to port ${PORT}...`))