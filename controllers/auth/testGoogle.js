const queryString = require('query-string')

const showLogin = (req, res) => {
  //kind of info we want from user
  const scopes = ['https://www.googleapis.com/auth/user.emails.read', 'profile'].join(' ')

  //create consent url for the frontend. when this url is clicked a pop will appear asking the user for consent/approval
  const queryParams = queryString.stringify({
    client_id: process.env.GOOGLE_CLIENT_ID,
    scope: scopes,
    redirect_uri: 'http://localhost:5000/api/auth/google',
    auth_type: 'rerequest',
    display: 'popup',
    response_type: 'code',
  })

  const urlForFrontend = `https://accounts.google.com/o/oauth2/v2/auth?${queryParams}`

  res.render('login', { url: urlForFrontend })
}
module.exports = showLogin
