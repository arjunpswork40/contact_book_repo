const jwt = require('jsonwebtoken');
const jwtConfig = require('../../../../config/jwt');
const bcrypt = require('bcrypt');
const User = require('../../../models/User');
const { makeJsonResponse } = require('../../../../utils/response')

module.exports = {
    login: async (req, res) => {
        try {

            const { email, password } = req.body;

            let httpcode = 401;
            let response = makeJsonResponse('Invalid credentials', {}, {}, httpcode, false)

            // Find user by email
            const user = await User.findOne({ email });

            if (!user) {
                return res.status(httpcode).json(response);
            }

            // Verify password
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(httpcode).json(response);
            }

            // Generate JWT token
            const token = jwt.sign({ sub: user._id }, jwtConfig.secret, { expiresIn: '1h' });
            console.log(token)
            await User.findByIdAndUpdate(user._id, {
                token_status: true
            })
            httpcode = 200;
            response = makeJsonResponse('LoggedIn successfuly', { user, token }, {}, httpcode, false)
            return res.status(httpcode).json(response);
        } catch (error) {
            let response = makeJsonResponse('Internal error occured', {}, error, 500, false)
            return res.status(500).json(response);
        }
    }
}
