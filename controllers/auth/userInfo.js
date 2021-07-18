const axios = require('axios')
const User = require('../../models/userModel')
const Error = require('../../utils/errorResponse')
const createAuthToken = require('../../utils/createAuthToken')

//TODO:refactor userInfo into a util that accepts type of service and based on type of service makes the appropriate call to get userinfo eg google,fb etc

const userInfo = async (req, res, next) => {
  const accessToken = req.cookies.accessToken

  try {
    //get user info from google
    const googleUrl = 'https://www.googleapis.com/oauth2/v3/userinfo'

    const userData = await axios({
      url: googleUrl,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    const userFromDb = await User.findOne({ googleUserId: userData.data.sub })

    if (!userFromDb) {
      throw new Error('We could not find a user with this credentilas')
    }

    userFromDb.photo =
      userFromDb.photo === ''
        ? (userFromDb.photo = userData.picture)
        : userFromDb.photo

    if (userFromDb.emailVerified === false){
      userFromDb.emailVerified = true
    } 
    
    await userFromDb.save()

    console.log(userData.data)

    return createAuthToken(userFromDb, 'user logged in successfully', 200, res)
  } catch (e) {
    console.log(e.message || e.response.data)
  }
}
module.exports = userInfo
