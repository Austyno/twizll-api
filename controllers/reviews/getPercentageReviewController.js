const Error = require('../../utils/errorResponse')
const PR = require('../../models/productReviewModel')

const reviewPercentage = async (req, res, next) => {
  const { productId } = req.params

  try {
    const ratings = await PR.find({ product: productId })
    const totalNumberOfRatings = ratings.length

    const fiveStar = ratings.filter(
      item => Math.floor(Number(item.rating)) === 5
    )
    const fiveStarPercentage = Math.floor((fiveStar.length / totalNumberOfRatings) * 100)

    const fourStar = ratings.filter(
      item => Math.floor(Number(item.rating)) === 4
    )
    const fourStarPercentage = Math.floor((fourStar.length / totalNumberOfRatings) * 100)

    const threeStar = ratings.filter(
      item => Math.floor(Number(item.rating)) === 3
    )
    const threeStarPercentage = Math.floor(
      (threeStar.length / totalNumberOfRatings) * 100
    )

    const twoStar = ratings.filter(
      item => Math.floor(Number(item.rating)) === 2
    )
    const twoStarPercentage = Math.floor(
      (twoStar.length / totalNumberOfRatings) * 100
    )

    res.status(200).json({
      status: 'success',
      message: 'percentage ratings retrieved successfully',
      data: {
        totalNumberOfRatings,
        fiveStarPercentage,
        fourStarPercentage,
        threeStarPercentage,
        twoStarPercentage,
      },
    })
  } catch (e) {
    return next(new Error(e.message, 500))
  }
}
module.exports = reviewPercentage
