const User = require('../../models/userModel')
const Error = require('../../utils/errorResponse')
const generateToken = require('../../utils/generateToken')


const login = async (req,res,next) => {
  const {email, password} = req.body

  const user = await User.findOne({email})
  
    if(!user){
      return next(new Error('your credentials are incorrect', 400))
    }

    if(!(user.isValidPassword(password,user.password))){
       return next(new Error('your credentials are incorrect', 400))
    }

    try{
      const token  = generateToken(user._id)

      res.status(200).json({
        status:'success',
        message:'user logged in successfully',
        data:user,
        token
      })

    }catch(e){
      return next(new Error(e.message,500))
    }
}

module.exports = login