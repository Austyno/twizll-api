const BankDetail = require('../../models/bankDetailsModel')
const Error = require('../../utils/errorResponse')


const addBankDetails = async(req,res,next) => {
  const seller = req.user
  const sellerStore = req.store
  const {bankName,accountNumber,accountName} = req.body

  if (!seller) {
    return next(new Error('You need to sign in to view this page', 401))
  }
  if (!sellerStore) {
    return next(new Error('Only store owners can perform this action', 403))
  }

  if(!bankName ||!accountNumber||!accountName){
    return next(new Error('Full bank details not provided',400))
  }

  try{
    const bank = await BankDetail.create({
        bankName,
        accountNumber,
        accountName,
        store: sellerStore.id
      })

   res.status(201).json({
     status:'success',
     message:'bank details added successfully',
     data:bank
   })

  }catch(e){
  return next(new Error(e.message,500))
  }
}
module.exports = addBankDetails

