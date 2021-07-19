
//admin can view all products or seller views their products only
const getAllProducts = (user, products) => {
  if (user.role === 'admin') {
    return products
  }
  return products.filter(product => product.owner === user._id)
}

//view a single product
const canViewProduct = (user, product) => {
  return user.role === 'admin' || product.owner === user._id
}

//seller can delete their product only
const canDeleteProduct = (user, product) => {
  return product.owner === user._id
}

//seller can update their products
const canUpdateProduct = (user, product) => {
  return product.owner === user._id
}

module.exports = {
  canViewProduct,
  getAllProducts,
  canDeleteProduct,
  canUpdateProduct,
}
