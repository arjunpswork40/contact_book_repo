const express = require("express");
const router = express.Router();
const {
    getPrivacyPolicy,
    getTermsAndConditions
} = require('../app/controllers/genralController')
const { isApiAuthenticated } = require('../app/middlewares/auth/isAuthenticated')


/* GET users listing. */

router.get("/privacy-policy", isApiAuthenticated, getPrivacyPolicy);
router.get("/terms-and-conditions", isApiAuthenticated, getTermsAndConditions);




module.exports = router;
