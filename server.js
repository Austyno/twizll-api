const path = require('path')
const express = require('express')
const dotenv = require('dotenv')
const mongoSanitize = require('express-mongo-sanitize')
const cookieParser = require('cookie-parser')
const helmet = require('helmet')
const xss = require('xss-clean')
const hpp = require('hpp')
const cors = require('cors')
const connectToDb = require('./config/db')
const Errors = require('./middleware/error')
const fileUpload = require('express-fileupload')
const app = express()
const stripe = require('stripe')

const Stripe = stripe(process.env.STRIPE_SECRET_KEY)
const webHook = require('./controllers/stripe/webHooksController')

dotenv.config({ path: './config/config.env' })
connectToDb()
app.post(
  '/api/stripe/webhook',
  express.raw({ type: 'application/json' }),
  webHook
  // (req, res) => {
  //   const sig = req.headers['stripe-signature']

  //   let event
  //   try {
  //     event = Stripe.webhooks.constructEvent(
  //       req.body,
  //       sig,
  //       process.env.STRIPE_TEST_WEBHOK_SECRET
  //     )
  //   } catch (err) {
  //     // On error, log and return the error message
  //     console.log(`❌ Error message: ${err.message}`)
  //     return res.status(400).send(`Webhook Error: ${err.message}`)
  //   }

  //   // Successfully constructed event
  //   console.log('✅ Success:', event.id)
  //   console.log(event.data.object)

  //   // Return a response to acknowledge receipt of the event
  //   res.json({ received: true })
  // }
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, './public')))
app.use(fileUpload({ useTempFiles: true }))

app.set('view engine', 'ejs')

//enable cors
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
)

app.use(async (req, res, next) => {
  res.set('Access-Control-Allow-Methods', [
    'GET',
    'POST',
    'PATCH',
    'PUT',
    'DELETE',
    'OPTIONS',
  ])
  res.set('Access-Control-Allow-Headers', [
    'Origin',
    'Content-Type',
    'X-Auth-Token',
    'Access-Control-Allow-Headers',
    'Authorization',
    'X-Requested-With',
    'Set-Cookie',
    'Access-Control-Allow-Credentials',
  ])

  if (req.method === 'OPTIONS') {
    res.sendStatus(200)
  } else {
    return next()
  }
})
const authRoutes = require('./routes/auth/authRoutes')
const sellerRoutes = require('./routes/seller/sellerRoutes')
const stripeRoutes = require('./routes/stripe/stripeRoutes')

app.use(mongoSanitize())

// Set security headers
app.use(helmet())

// Prevent XSS attacks
app.use(xss())

// Prevent http param pollution
app.use(hpp())
app.use(cookieParser())

app.use('/api/auth', authRoutes)

app.use('/api/seller', sellerRoutes)
app.use('/api/stripe', stripeRoutes)

app.use(Errors)

const PORT = 5000
app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
)
process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! 🙄 Shutting down...')
  console.error(err.name, err.message)
  // process.exit(1)
})

process.on('unhandledRejection', err => {
  console.error(err.name, err.message)
  console.log('UNHANDLED REJECTION! 😞 Shutting down Server...')
  // process.exit(1)

  // server.close(() => {
  // })
})
