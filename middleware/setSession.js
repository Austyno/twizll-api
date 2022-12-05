const session = require('express-session')
const MongoStore = require('connect-mongo')

//  use session

const url =
  process.env.NODE_ENV === 'development'
    ? process.env.MONGODB_DEV_URL
    : process.env.MONGODB_URL

const setSession = session({
  name: 'session',
  store: MongoStore.create({
    mongoUrl: url,
    crypto: {
      secret: process.env.SESSION_SECRET,
    },
    ttl: 14 * 24 * 60 * 60, // 2 weeks - 14 days,
    autoRemove: 'native',
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none',
    httpOnly: true,
    maxAge: 14 * 24 * 60 * 60 * 1000, // 2 weeks - 14 days,
  },
  resave: false,
  saveUninitialized: false,
  secret: process.env.SESSION_SECRET,
})

module.exports = setSession
