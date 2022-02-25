const config = require('./utils/config.js')
const express = require('express')
const middleware = require("./utils/middleware")
require('express-async-errors')
const app = express()
const cors = require('cors')
const blogRouter = require('./controller/blogRouter')
const usersRouter = require("./controller/usersRouter")
const loginRouter = require("./controller/loginRouter")
const logger = require('./utils/logger.js')
const mongoose = require('mongoose')

logger.info('connecting to MongoDB')
mongoose.connect(config.MONGODB_URI)
.then(()  => {
  logger.info('connected to MongoDB')
})
.catch((error) => {
  logger.error('error connecting to MongoDB:', error.message)
})

app.use(cors())
app.use(express.json())
app.use(middleware.tokenExtraktor)
app.use(middleware.requestLogger)
app.use("/api/users", usersRouter)
app.use('/api/blogs', blogRouter)
app.use("/api/login", loginRouter)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app