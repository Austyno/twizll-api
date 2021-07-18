const generateToken = require('../../utils/generateToken')
const User = require('../../models/userModel')
const Error = require('../../utils/errorResponse')
const axios = require('axios')
const queryString = require('query-string')

//types of info we want from user
const scopes = ['https://www.googleapis.com/auth/userinfo.email', 'profile','https://www.googleapis.com/auth/plus.me']

//create consent url for the frontend. when this url is clicked a pop will appear asking the user for consent/permission
const queryParams = queryString.stringify({
  client_id: process.env.GOOGLE_CLIENT_ID,
  scope: scopes,
  redirect_uri: 'http://localhost:5000/api/auth/google',
  auth_type: 'rerequest',
  display: 'popup',
  response_type: 'code',
})

const urlForFrontend = `https://accounts.google.com/o/oauth2/v2/auth?${queryParams}`

const googleAuth = async (req, res, next) => {
  const { code } = req.query

  console.log(req.query)

  const client_id = process.env.GOOGLE_CLIENT_ID
  const client_secret = process.env.GOOGLE_CLIENT_SECRET
  const grant_type = 'authorization_code'
  const url = 'https://oauth2.googleapis.com/token'

  try {
    //get access token from google
    const { data } = await axios({
      url,
      method: 'POST',
      params: {
        client_id,
        client_secret,
        redirect_uri: 'http://localhost:5000/api/auth/google',
        code,
        grant_type,
      },
    })
    const acessTokenFromGoogle = data.access_token
    res.cookie('accessToken', acessTokenFromGoogle, {
      maxAge: 900000,
      httpOnly: true,
    })
    console.log(data)
    res.redirect('/api/auth/me')

  }catch(e){
    console.log(e.response.data || e.message)
  }    
}
module.exports = googleAuth
