const {model, Schema} = require('mongoose')

const mainCategorySchema = new Schema({
  name:{
    type:String
  }
},{virtuals:true})

mainCategorySchema.virtual('category', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'mainCategory',
  justOne:false
})

module.exports = model('MainCategory', mainCategorySchema)