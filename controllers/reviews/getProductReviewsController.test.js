const getProductReviewsController = require('./getProductReviewsController')
// @ponicode
describe('getProductReviewsController', () => {
  test('0', async () => {
    await getProductReviewsController(undefined, undefined, undefined)
  })
})
