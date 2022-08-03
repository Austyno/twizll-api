const { Response } = require('http-status-codez')

const responseTemplate = (res, statusCode, message) =>
  res.status(statusCode).json({
    status: `${res.statusCode}`.startsWith('4') ? 'fail' : 'error',
    code: res.statusCode,
    message,
  })

const handleDBValidationErrors = (err, res) => {
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(el => el.message)
    const message = `Invalid input data: ${errors.join('. ')}`

    return responseTemplate(res, Response.HTTP_UNPROCESSABLE_ENTITY, message)
  }
}

const handleDuplicateDBFields = (err, res) => {
  if (err.code === 11000) {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0]
    const message = `Duplicate field value: ${value}. Please use another value!`

    return responseTemplate(res, Response.HTTP_BAD_REQUEST, message)
  }
}

const handleInvalidJWT = (err, res) => {
  if (err.name === 'JsonWebTokenError') {
    return responseTemplate(
      res,
      Response.HTTP_UNAUTHORIZED,
      'Invalid token. Please login again!'
    )
  }
}

const handleExpiredJWT = (err, res) => {
  if (err.name === 'TokenExpiredError') {
    return responseTemplate(
      res,
      Response.HTTP_UNAUTHORIZED,
      'Your token has expired! Please log in again.'
    )
  }
}

// const sendDevelopmentErrors = (err, res) => {
// 	res.status(err.statusCode).json({
// 		status: err.status,
// 		error: err,
// 		message: err.message,
// 		stack: err.stack,
// 	})
// }

const sendProductionErrors = (err, res) => {
  handleDBValidationErrors(err, res)

  handleDuplicateDBFields(err, res)

  handleInvalidJWT(err, res)

  handleExpiredJWT(err, res)

  return responseTemplate(res, err.statusCode, err.message)
}

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || Response.HTTP_INTERNAL_SERVER_ERROR
  err.status = err.status || 'error'

  // if (process.env.NODE_ENV === 'development') {
  //   sendDevelopmentErrors(err, res)
  // } else if (process.env.NODE_ENV === 'production') {
  //   sendProductionErrors(err, res)
  // }
}
