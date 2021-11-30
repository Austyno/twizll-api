const Error = require('../../utils/errorResponse')
const Buyer = require('../../models/buyerModel')
const LP = require('../../models/loyalityModel')

// Note: every 20 pounds = 1 point
//every 100 points = 2 pounds


const loyalityPoints = async (req,res,next) => {
  const buyer = req.user

  if(!buyer){
    return next(new Error('The buyer is required',400))
  }


try{
  const loyalityExist = await LP.findOne({buyer: buyer.id})

  if(!loyalityExist){
    return next(new Error('User does not have loyality points',400))
  }

  const pointsValue = (loyalityExist.points * 2)/100

    res.status(200).json({
      status: 'success',
      message: 'points retrieved successfully',
      data: { points: loyalityExist.points, value: pointsValue },
    })

}catch(e){
  return next(new Error(e.message,500))
}

}

module.exports = loyalityPoints
