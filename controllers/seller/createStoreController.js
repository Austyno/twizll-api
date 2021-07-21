const Store = require('../../models/storeModel')
const Error = require('../../utils/errorResponse')


//seller must be logged in
const createStore = async(req,res,next) => {
  const seller = req.user
  const owner = seller._id
  const storeName = req.body.storeName

  if(!seller){
    return next(new Error('You need to sign in to create a store',403))
  }

  try{
    const store = await Store.create({
      storeName,
      owner
    })

    res.status(201).json({
      status:'success',
      message:'Store created successfully',
      data: store
    })

  }catch(e){
    return next(new Error(e.message, 500))

  }

}
module.exports = createStore