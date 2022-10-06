const Favourite = require('../../models/favouritesModel')
const Style = require('../../models/styleModel')
const Stylist = require('../../models/stylistModel')

const followStyle = async (req, res, next) => {
  const { style_id } = req.body

  const buyer = req.user

  if (!style_id) {
    return res.status(400).json({
      status: 'failed',
      message: 'style id is required',
      data: '',
    })
  }

  try {
    const style = await Style.findOne({ id: style_id })
    if (!style) {
      return res.status(404).json({
        status: 'failed',
        message: 'we could not find the style in our records',
        data: '',
      })
    }
    const stylist = await Stylist.find({ id: style.stylist })

    const favorite_style_exist = await Favourite.findOne({ owner: buyer.id })
    if (!favorite_style_exist && !stylist.followers.includes(buyer.id)) {

      const fav_style = await Favourite.create({
        owner: buyer.id,
        favourite_styles: [style_id],
      })

      stylist.followers.push(buyer.id)
      stylist.save()

      return res.status(201).json({
        status: 'success',
        message: 'favourite style added successfully',
        data: fav_style,
      })
    }
    if (favorite_style_exist.favourite_styles.includes(style_id)) {
      const remove_style = favorite_style_exist.favourite_styles.filter(
        item => item != style_id.toString()
      )
      favorite_style_exist.favourite_styles = remove_style
      favorite_style_exist.save()

      // remove from stylist followers if its present
      if(stylist.followers.includes(buyer.id)){
        
      }
      return res.status(200).json({
        status: 'success',
        message: 'style removed from styles favourites successfully',
        data: favorite_style_exist,
      })
    }

    favorite_style_exist.favourite_styles.push(style_id)
      favorite_style_exist.save()
    res.status(200).json({
      status: 'success',
      message: 'style added to favaourites successfully',
      data: favorite_style_exist,
    })

  } catch (e) {
    return next(e)
  }
}
module.exports = followStyle
