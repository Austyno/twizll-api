const Collection = require('../../models/collectionModel')

const getCollection = async (req, res, next) => {
  const { collectionId } = req.params
  try {
    const collection = await Collection.findById(collectionId).populate('styles')

    if (!collection) {
      return res.status(404).json({
        status: 'Not found',
        message: 'collection does not exist',
        data: '',
      })
    }

    return res.status(200).json({
      status: 'success',
      message: 'collection with styles retrieved',
      data: collection,
    })
  } catch (e) {
    return next(e)
  }
}
module.exports = getCollection
