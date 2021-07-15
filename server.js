const path = require('path')
const express = require('express')
const dotenv = require('dotenv')
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet')
const xss = require('xss-clean')
const hpp = require('hpp')
const cors = require('cors')
const connectToDb = require('./config/db')
const Errors = require('./middleware/error')
const app = express()

dotenv.config({ path: './config/config.env' })
connectToDb()

app.use(express.json());

app.set('view engine','ejs')


//enable cors
app.use(cors())
const authRoutes = require('./routes/authRoutes')

app.use(mongoSanitize())

// Set security headers
app.use(helmet())

// Prevent XSS attacks
app.use(xss())

// Prevent http param pollution
app.use(hpp())

app.use('/api/auth', authRoutes)





app.use(Errors)

const PORT = process.env.PORT || 5000
const server = app.listen(
	PORT,
	console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
)
process.on('uncaughtException', err => {
	console.log('UNCAUGHT EXCEPTION! 🙄 Shutting down...')
	console.error(err.name, err.message)
	process.exit(1)
})

process.on('unhandledRejection', err => {
	console.error(err.name, err.message)
	console.log('UNHANDLED REJECTION! 😞 Shutting down Server...')
	server.close(() => {
		process.exit(1)
	})
})