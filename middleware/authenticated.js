const jwt = require('jsonwebtoken');
const Error = require('../utils/errorResponse');
const User = require('../models/userModel');
const Store = require('../models/storeModel');
const Buyer = require('../models/buyerModel');
const Seller = require('../models/sellerModel');
const Stylist = require('../models/stylistModel');
const findUser = require('../controllers/auth/findUser');

// Protect routes
const authenticated = role => {
    return async (req, res, next) => {
        let token;

        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1];
        } else if (req.cookies.token) {
            token = req.cookies.token;
        }

        // Make sure token exists
        if (token == null) {
            return res.status(403).json({
                status: 'forbidden',
                message: 'you need to sign in to access this resource',
                data: '',
            });
        }

        //ensure token  is in the db
        const userToken = findUser(token, (id = null));

        if (!userToken || userToken == 'Invalid token') {
            return next(
                new Error('you are logged out, please login to continue', 400)
            );
        }
        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = findUser((token = null), decoded.id);
            if (req.user == null) {
                return next(
                    new Error(
                        'We could not find a user with the above token',
                        400
                    )
                );
            }

            req.store = null;

            if (role === 'seller' && req.store == null) {
                //locate seller store and add to request object
                req.store = await Store.findOne({ owner: decoded.id });
            }

            next();
        } catch (e) {
            if (e.name === 'TokenExpiredError') {
                return next(
                    new Error(
                        'Your session has expired. Please log in again.',
                        403
                    )
                );
            }
            if (e.message === 'jwt malformed') {
                return next(
                    new Error('Invalid token. Please log in again.', 403)
                );
            }
            if (e.message === 'jwt must be provided') {
                return next(
                    new Error('You need to login to access this resource', 403)
                );
            }
            return next(e);
        }
    };
};
module.exports = authenticated;
