
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

  const session = BankDetail.db.startSession();
    session.startTransaction()

  try{
    const addBank = await BankDetail.create(
      {
        bankName,
        accountNumber,
        accountName,
        store: sellerStore.id
      },
      { session }
    )

    console.log(addBank)

   await addBank[0].save()
   await session.commitTransaction()

   res.status(201).json({
     status:'success',
     message:'bank details added successfully'
   })

  }catch(e){
    await session.arbotTransaction()
  return next(new Error(e.message,500))
  }finally{
    await session.endSession()
  }
}
module.exports = addBankDetails