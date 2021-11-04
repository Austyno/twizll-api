const Collection = require('../../models/collectionModel')
const Error = require('../../utils/errorResponse')

const getCollections = async (req, res, next) => {
  try {
    const collections = await Collection.find().populate(
      'products',
      'name unitPrice briefDesc mainPhoto'
    )

    res.status(200).json({
      status: 'success',
      message: 'collections retrieved successfully',
      data: collections,
    })
  } catch (e) {
    return next(new Error(e.message))
  }
}
module.exports = getCollections
