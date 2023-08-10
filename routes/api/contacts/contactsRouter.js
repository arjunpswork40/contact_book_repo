const express = require("express");
const router = express.Router();
const {
    storeContact,
    getContactList,
    getContact,
    updateContact,
    deleteContact
} = require('../../../app/controllers/api/contacts/contactsController')

const {
    validateContactStoreRequest,
    validateContactListRequest,
    validateContactUpdateRequest
} = require('../../../validators/api/contacts/contactValidator')

/* GET users listing. */
router.get("/", validateContactListRequest, getContactList);
router.get("/:id", getContact);


/* POST users listing. */

router.post("/", validateContactStoreRequest, storeContact);

/* PUT users listing. */

router.put("/:id", validateContactUpdateRequest, updateContact);

/* DELETE users listing. */

router.delete("/:id", deleteContact);

module.exports = router;