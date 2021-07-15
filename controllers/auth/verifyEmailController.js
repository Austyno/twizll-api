const User = require('../../models/userModel')
const Error = require('../../utils/errorResponse')

//TODO:create beautifull ejs pages for error and thank you pages

const verifyEmail = async (req,res,next) => {
  const {code} = req.params

  const user = await User.find({
      $and:[
        {emailVerificationCode:code},
      {emailCodeTimeExpiry: {$gt: Date.now()}}
      ]
    })

    if(!user){
      //Render ejs page showing error
      res.render('error',{message:'the verification code does not exist or has expired'})
    }

  try{
    //get user with this code and update db
    const verifyUser = await User.findOne({emailVerificationCode:code})

    verifyUser.emailVerificationCode = ''
    verifyUser.emailCodeTimeExpiry = ''
    verifyUser.emailVerified = true

    await verifyUser.save()

    //render thank you page after updating db
    res.render('thank-you.ejs',{message:"thank you, your email has been verified"})


  }catch(e){
    console.log(e)
    return res.render('error.ejs',{message:e.message})
  }

}

module.exports = verifyEmail