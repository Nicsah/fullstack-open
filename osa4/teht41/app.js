const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const middleware = require('./utils/middleware')
const loginRouter = require('./controllers/login')
const usersRouter = require('./controllers/users')


mongoose.connect(config.MONGODB_URI)


app.use(cors())
app.use(express.json())

app.use('/api/blogs',blogsRouter)
app.use('/api/users',usersRouter)
app.use('/api/login',loginRouter)

app.use(middleware.requestLogger)
app.use(middleware.errorHandler)
app.use(middleware.unknownEndpoint)

module.exports = app