const { makeErrorJson } = require("../../../utils/response");
const { body, validationResult, query } = require('express-validator');
const validator = require('validator');

const validateContactStoreRequest = [
    body('email').isEmail().withMessage('Invalid email address'),
    body('phone').isMobilePhone('any').withMessage('Invalid phone number'),
    body('firstName').notEmpty().withMessage('First Name is required'),
    body('lastName').notEmpty().withMessage('Last Name is required'),
    body('address').notEmpty().withMessage('Address is required'),
    body('city').notEmpty().withMessage('City is required'),
    body('state').notEmpty().withMessage('State is required'),
    body('country').notEmpty().withMessage('Country is required'),
    body('zipCode').notEmpty().withMessage('ZipCode is required'),
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

const validateContactListRequest = [
    query('pageNumber').notEmpty().isInt().withMessage('Page Number is required.Count of the page as per page size.Pagination is important for API response speed.'),
    query('PageSize').notEmpty().isInt().withMessage('Page size is required.Number of records need per page.Pagination is important for API response speed.'),
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

const validateContactRequest = [
    query('id').notEmpty().withMessage('Contact id is required'),
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

const validateContactUpdateRequest = [
    body('email').optional().isEmail().withMessage('Invalid email address'),
    body('phone').optional().isMobilePhone('any').withMessage('Invalid phone number'),
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
    validateContactUpdateRequest,
    validateContactRequest,
    validateContactListRequest,
    validateContactStoreRequest
};