const User = require("../models/User");
const { hashPassword } = require('../../utils/auth');
const { makeJsonResponse } = require('../../utils/response')
module.exports = {

    createDemoUser: async (req, res, next) => {
        let user = await User.findOne({
            email: 'demo@user.com'
        })
        if (!user) {
            let newUser = new User({
                name: 'demo-user',
                email: 'demo@user.com'
            })
            let hashedPassword = await hashPassword('demo@123')
            if (hashedPassword.success) {
                newUser.password = hashedPassword.data.hashedValue;

                await newUser.save()
                let response = makeJsonResponse('demo user created', newUser, {}, 200, false)

                return res.status(200).json(response);
            } else {
                let response = makeJsonResponse('internal error', {}, error, 500, false)

                return res.status(500).json(response);
            }
        } else {
            let response = makeJsonResponse('demo user created', user, {}, 200, false)

            return res.status(200).json(response);
        }
    }




};
