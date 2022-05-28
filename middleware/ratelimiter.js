const rateLimit = require('express-rate-limit')


const TokenRateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 mins window
  max: 1, // start blocking after 1 requests
  message: 'Too many requests, please try again after 5 mins',
})

module.exports = TokenRateLimiter
