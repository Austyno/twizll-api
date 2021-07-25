const logOut = (req, res, next) => {
  res.cookie('token', 'loggedout', {
    expires: new Date(Date.now() + 5 * 1000),
    httpOnly: true,
  })

  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully.',
  })
}
module.exports = logOut
