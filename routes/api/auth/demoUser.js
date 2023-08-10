const express = require("express");
const router = express.Router();
const {
    createDemoUser
} = require('../../../app/controllers/genralController')

/* GET users listing. */

router.get("/", createDemoUser);


module.exports = router;