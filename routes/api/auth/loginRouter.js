const express = require("express");
const router = express.Router();
const {
    login
} = require('../../../app/controllers/api/auth/login')

const {
    loginRequestValidator
} = require('../../../validators/api/auth/loginValidator')

/* POST users listing. */

router.post("/", loginRequestValidator, login);


module.exports = router;