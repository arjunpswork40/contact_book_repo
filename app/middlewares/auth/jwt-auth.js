const passport = require('../../../config/passport-setup');
const { makeJsonResponse } = require("../../../utils/response");
const User = require('../../models/User');
module.exports = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, async (err, user, info) => {
        let bearerToken = req.headers.authorization;
        let tokenForValidation = bearerToken.split(' ')[1]


        if (err) {
            let response = makeJsonResponse('Internal error occured', {}, err, 500, false)
            return res.status(500).json(response);
        }

        if (!user) {
            let response = makeJsonResponse('Unauthorized', {}, {}, 401, false)
            return res.status(401).json(response);
        }

        let userModel = await User.findOne({
            _id: user.id,
            token_status: true
        })

        if (!userModel) {
            let response = makeJsonResponse('Unauthorized', {}, {}, 401, false)
            return res.status(401).json(response);
        }
        // User is authenticated, proceed to the next middleware or route handler
        req.user = user;
        req.validToken = tokenForValidation;
        next();
    })(req, res, next);
};
