const { makeJsonResponse } = require("../../../../utils/response");
const Contact = require("../../../models/Contact");

module.exports = {

    getContactList: async (req, res, next) => {
        try {
            let pageNumber = req.body.pageNumber || 1;
            let pageSize = req.body.pageSize || 10;

            const totalRecords = await Contact.countDocuments();

            let contacts = await Contact.find()
                .skip((pageNumber - 1) * pageSize)
                .limit(pageSize);

            let response = makeJsonResponse('Contact List', { contacts, totalRecords }, {}, 200, true)

            return res.status(201).json(response);
        } catch (error) {
            let response = makeJsonResponse('Internal error occured', {}, error, 500, true)
            return res.status(500).json(response);
        }
    },

    storeContact: async (req, res, next) => {
        let {
            email,
            phone,
            firstName,
            lastName,
            address,
            city,
            state,
            country,
            zipCode
        } = req.body

        try {
            const newContact = new Contact({
                email: email,
                phone: phone,
                firstName: firstName,
                lastName: lastName,
                address: address,
                city: city,
                state: state,
                country: country,
                zipCode: zipCode
            });

            await newContact.save();

            let response = makeJsonResponse('Contact saved successfully', newContact, {}, 200, true)

            return res.status(200).json(response);
        } catch (error) {
            console.log(error)
            if (error.code === 11000) {
                if (error.keyPattern.email === 1) {
                    let response = makeJsonResponse(`Email duplication.`, {}, { error: 'Email is already saved' }, 400, false);
                    return res.status(400).json(response);
                } else if (error.keyPattern.phone === 1) {
                    let response = makeJsonResponse(`Phone number duplication.`, {}, { error: 'Phone number is already saved' }, 400, false);
                    return res.status(400).json(response);
                }

            } else {
                let response = makeJsonResponse('Internal error occured', {}, error, 500, true)
                return res.status(500).json(response);
            }
        }
    },

    getContact: async (req, res, next) => {
        try {
            let id = req.params.id
            let contact = await Contact.findById(id);
            let response = contact ? makeJsonResponse('Contact fetched successfuly', contact, {}, 200, true) : makeJsonResponse('No contact fount', {}, {}, 200, true)

            return res.status(200).json(response);
        } catch (error) {
            let httpcode = 500;
            let response = makeJsonResponse('Internal error occured', {}, error, httpcode, true)
            if (error.name === 'CastError' && error.kind === 'ObjectId') {
                httpcode = 400
                response = makeJsonResponse('Invalid contact id', {}, {}, httpcode, true)
            }
            return res.status(httpcode).json(response);
        }
    },

    updateContact: async (req, res, next) => {
        let id = req.params.id;
        const updatedData = req.body;

        try {
            if (id) {
                const updatedContact = await Contact.findOneAndUpdate(
                    { _id: id },
                    { $set: updatedData },
                    { new: true }
                );
                let httpcode = 200;
                if (!updatedContact) {
                    httpcode = 404;
                    let response = makeJsonResponse('Contact not found', {}, {}, httpcode, false)
                    return res.status(httpcode).json(response);
                }

                let response = makeJsonResponse('Contact updated successfully', updatedContact, {}, httpcode, true)
                return res.status(httpcode).json(response);
            } else {
                let httpcode = 404;
                let response = makeJsonResponse('Contact id is required', {}, {}, httpcode, false)
                return res.status(httpcode).json(response);
            }

        } catch (error) {
            let response = makeJsonResponse('Internal error occured', {}, error, 500, true)
            if (error.name === 'CastError' && error.kind === 'ObjectId') {
                httpcode = 400
                response = makeJsonResponse('Invalid contact id', {}, {}, httpcode, true)
            } else if (error.code === 11000) {
                if (error.keyPattern.email === 1) {
                    response = makeJsonResponse(`Email duplication.`, {}, { error: 'Email is already saved' }, 400, false);
                    return res.status(400).json(response);
                } else if (error.keyPattern.phone === 1) {
                    response = makeJsonResponse(`Phone number duplication.`, {}, { error: 'Phone number is already saved' }, 400, false);
                    return res.status(400).json(response);
                } else {
                    response = makeJsonResponse(`Value duplication occured.`, {}, { error: 'Please check the values.' }, 400, false);
                    return res.status(400).json(response);
                }

            }
            return res.status(500).json(response);
        }

    },

    deleteContact: async (req, res, next) => {
        try {
            let id = req.params.id;

            if (id) {
                let deleteContact = await Contact.findByIdAndDelete(id);

                let response = makeJsonResponse('Contact deleted!', {}, {}, 200, true)

                return res.status(200).json(response);
            } else {
                let response = makeJsonResponse('Contact id is required for deletion', {}, {}, 400, false)

                return res.status(400).json(response);
            }
        } catch (error) {

        }
    }





};
