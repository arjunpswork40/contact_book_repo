const express = require("express");
const router = express.Router();
const {
    logout
} = require('../../../app/controllers/api/auth/logout')


/* GET users listing. */

router.get("/", logout);


module.exports = router;