const jwt = require('jsonwebtoken');
const jwtConfig = require('../../../../config/jwt');
const bcrypt = require('bcrypt');
const User = require('../../../models/User');
const { makeJsonResponse } = require('../../../../utils/response')

module.exports = {
    logout: async (req, res) => {
        let token = req.validToken;
        let id = req.user?.id

        try {

            await User.findByIdAndUpdate(id, {
                token_status: false
            })
            let response = makeJsonResponse('LogOut successfuly', {}, {}, 200, true)
            return res.status(200).json(response);
        } catch (error) {
            let response = makeJsonResponse('Internal error occured', {}, error, 500, false)
            return res.status(500).json(response);
        }
    }
}
