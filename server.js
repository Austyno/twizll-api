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
const morgan = require('morgan')

const url =
  process.env.NODE_ENV === 'development'
    ? process.env.MONGODB_DEV_URL
    : process.env.MONGODB_URL

const Stripe = stripe(
  'sk_test_51H0RkNDPf3hBisiJlkGknCCyzzDhqymjc84C3pi8lBX0Ab4FzVccAx6Nzw2FDKFkqyozjuZqGqXF3nHx84wTUFWa00bQbyx23N'
)
const webHooks = require('./controllers/stripe/webHooksController')

dotenv.config({ path: './config/config.env' })
connectToDb()
app.post(
  '/api/stripe/webhook',
  express.raw({ type: 'application/json' }),
  webHooks
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(fileUpload({ useTempFiles: true }))

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'public/views'))
app.use(express.static(path.join(__dirname, './public/static')))

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
const cartRoutes = require('./routes/cart/cartRoutes')
const reviewsRoutes = require('./routes/reviews/reviewRoutes')
const buyerRoutes = require('./routes/buyer/buyerRoutes')
const categoryRoutes = require('./routes/category/categoryRoutes')

app.use(mongoSanitize())

// Set security headers ( fix issue with blocking stripe url in ejs)
// app.use(
//   helmet.contentSecurityPolicy({
//       directives: {
//         ...helmet.contentSecurityPolicy.getDefaultDirectives(),
//         'script-src': ['self', 'https://js.stripe.com/v3/'],
//       },
//     })
// )

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}
// Prevent XSS attacks
app.use(xss())

// Prevent http param pollution
app.use(hpp())
app.use(cookieParser())

app.use('/api/auth', authRoutes)

app.use('/api/seller', sellerRoutes)
app.use('/api/stripe', stripeRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/reviews', reviewsRoutes)
app.use('/api/buyer', buyerRoutes)
app.use('/api/categories', categoryRoutes)

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
