const search = (model, populate) => async (req, res, next) => {
  let query

  //copy query string
  const queryObj = { ...req.query }

  //remove fields
  const removeFields = ['select', 'sort', 'limit', 'page']

  removeFields.forEach(param => delete queryObj[param])

  let queryStr = JSON.stringify(queryObj)

  queryStr = queryStr.replace(/\b(gt|lt|gte|lte|in)\b/g, match => `$${match}`)

  query = model.find(JSON.parse(queryStr))

  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ')
    query = query.select(fields)
  }

  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ')
    query = query.sort(sortBy)
  } else {
    query = query.sort('-createdAt')
  }

  const page = parseInt(req.query.page, 10) || 1
  const limit = parseInt(req.query.limit, 10) || 25
  const startIndex = (page - 1) * limit
  const endIndex = page * limit
  const total = await model.countDocuments()

  query = query.skip(startIndex).limit(limit)

  if (populate) {
    if (Array.isArray(populate)) {
      for (let i = 0; i < populate.length; i++) {
        query = query.populate(populate[i])
      }
    }
  }
  let verifiedProducts
  await query.then(res => {
    verifiedProducts = res.filter(
      item =>
        item.store.storeVerified == 'verified' && item.store.activeSubscription == true
    )
  })

  const pagination = {}

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    }
  }
  if (startIndex > 0) {
    pagination.pre = {
      page: page - 1,
      limit,
    }
  }

  req.search = {
    status: 'success',
    pagination,
    count: verifiedProducts.length,
    data: verifiedProducts,
  }
  next()
}

module.exports = search

