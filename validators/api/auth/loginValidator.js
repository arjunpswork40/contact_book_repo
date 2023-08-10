const { makeErrorJson } = require("../../../utils/response");
const { body, validationResult, query } = require('express-validator');

const loginRequestValidator = [
    body('email').isEmail().notEmpty().withMessage('Required a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let errorsFromBodyParser = errors.array();
            let finalErrorResponse = {};
            for (let error of errorsFromBodyParser) {
                finalErrorResponse[error.param] = error.msg
            }

            response = makeErrorJson(400, finalErrorResponse);
            console.log(response)
            return res.status(400).json(response);
        }
        next();
    }
];


module.exports = {
    loginRequestValidator
};