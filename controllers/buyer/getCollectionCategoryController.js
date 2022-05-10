const CollectionCat = require('../../models/collectionCategoryModel')
const Error = require('../../utils/errorResponse')

const collectionCat = async (req, res, next) => {
  const { collectionId } = req.params

  if (!collectionId) {
    return next(
      new Error(
        'Please pass in the collection id to get the categories that belong to this collection',
        400
      )
    )
  }
  try {
    const docs = await CollectionCat.find({ collections: collectionId })


    res.status(200).json({
      status: 'success',
      message: 'collection categories retrieved successfully',
      data: docs,
    })
  } catch (e) {
    return next(new Error(e.message, 500))
  }
}
module.exports = collectionCat
