
//admin can view all products/seller views their products only
const viewAllMyProducts = (userId, products) => {
  return products.filter(product => product.owner === userId)
}

//view a single product
const viewMyProduct = (user, product) => {
  return user.role === 'admin' || product.owner === user._id
}

//seller can delete their product only
const canDeleteMyProduct = (user, product) => {
  return product.owner === user._id
}

//seller can update their products
const canUpdateMyProduct = (user, product) => {
  return product.owner === user._id
}

module.exports = {
  viewMyProduct,
  viewAllMyProducts,
  canDeleteMyProduct,
  canUpdateMyProduct,
}
