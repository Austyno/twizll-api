const Buyer = require('../../models/buyerModel');
const Seller = require('../../models/sellerModel');
const Stylist = require('../../models/stylistModel');

const findUser = async (token, id) => {

    if (token !== null) {
    if (typeof token !== 'string') return 'Invalid token';

    const buyer = await Buyer.findOne({ token });
    if (buyer) return true;

    const seller = await Seller.findOne({ token });
    if (seller) return true;

    const stylist = await Stylist.findOne({ token });
    if (stylist) return true;

    return 'Invalid token';
    }

    if (id !== null) {
        const buyer = await Buyer.findById(id);
    if (buyer) return buyer;

    const seller = await Seller.findById(id);
    if (seller) return seller;

    const stylist = await Stylist.findById(id);
    if (stylist) return stylist;

    return null
    }
};

module.exports = findUser;
