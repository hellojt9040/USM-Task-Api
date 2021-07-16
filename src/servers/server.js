require('../db/mongoose') //connecting database
const express = require('express')
// const postRouter = require('../router/post-router')
const userRouter = require('../router/user-router')
const bodyParser = require('body-parser')

//middleWare
const allowCORS = require('../middlewares/allowCORS')

//running express
const app = express()

// parsing
app.use(express.json())  //app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

app.use(allowCORS)
// app.use(postRouter)
app.use(userRouter)

module.exports = app
