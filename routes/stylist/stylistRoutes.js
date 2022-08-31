const router = require('express').Router()
const authRole = require('../../middleware/authRole')
const authenticated = require('../../middleware/authenticated')
const createCollection = require('../../controllers/stylist/createCollectionController')
const getCollections = require('../../controllers/stylist/getCollectionsController')
const createStyle = require('../../controllers/stylist/createStyleController')
const getStyle = require('../../controllers/stylist/getStyleController')
const getSingleCollection = require('../../controllers/stylist/getSingleCollection')

router.route('/collections')
        .post(createCollection)
router.route('/collections').get(getCollections)

router.route('/collections/:collectionId').get(getSingleCollection)
// style
router
  .route('/styles')
  .post(authenticated('stylist'), authRole('stylist'), createStyle)

  router.route('/styles/:style_id').get(getStyle)

module.exports = router
