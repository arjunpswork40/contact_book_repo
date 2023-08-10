describe('getContactList', () => {
    let contactController;
    let contactModel;
    let validator;
    let request;
    let response;

    beforeEach(() => {
        contactController = require('../app/controllers/api/contacts/contactsController');
        contactModel = require('../app/models/Contact');
        validator = require('../validators/api/contacts/contactValidator');
        request = {
            body: {
                pageNumber: 1,
                pageSize: 10
            }
        };
        response = {
            status: 200,
            json: jest.fn()
        };
    });

    it('should return contact list', async () => {
        const totalRecords = 10;
        const contacts = ['contact1', 'contact2'];

        const contact = new contactModel({
            name: 'John Doe',
            email: 'johndoe@example.com',
            phone: '1234567890'
        });
        contact.save();

        sinon.stub(contactModel, 'countDocuments').resolves(totalRecords);
        sinon.stub(contactModel, 'find').resolves(contacts);

        const result = await contactController.getContactList(request, response);

        expect(result.status).toBe(200);
        expect(result.json).toHaveProperty('message');
        expect(result.json.message).toBe('Contact List');
        expect(result.json).toHaveProperty('data');
        expect(result.json.data).toHaveProperty('contacts');
        expect(result.json.data.contacts).toEqual(contacts);
        expect(result.json).toHaveProperty('totalRecords');
        expect(result.json.totalRecords).toBe(totalRecords);

        contactModel.countDocuments.restore();
        contactModel.find.restore();
    });

    it('should handle invalid request', async () => {
        request.body.pageNumber = null;
        request.body.pageSize = null;

        const result = await contactController.getContactList(request, response);

        expect(result.status).toBe(400);
        expect(result.json).toHaveProperty('message');
        expect(result.json.message).toBe('Invalid request');
        expect(result.json).toHaveProperty('errors');
        expect(result.json.errors).toHaveProperty('pageNumber');
        expect(result.json.errors.pageNumber).toHaveProperty('message');
        expect(result.json.errors.pageNumber.message).toBe('Page number is required');
        expect(result.json).toHaveProperty('errors');
        expect(result.json.errors.pageSize);
        expect(result.json.errors.pageSize).toHaveProperty('message');
        expect(result.json.errors.pageSize.message).toBe('Page size is required');

        contactModel.countDocuments.restore();
        contactModel.find.restore();
    });

    it('should handle internal server error', async () => {
        const error = new Error('Database error');

        sinon.stub(contactModel, 'countDocuments').rejects(error);

        const result = await contactController.getContactList(request, response);

        expect(result.status).toBe(500);
        expect(result.json).toHaveProperty('message');
        expect(result.json.message).toBe('Internal error occurred');
        expect(result.json).toHaveProperty('error');
        expect(result.json.error).toHaveProperty('message');
        expect(result.json.error.message).toBe(error.message);

        contactModel.countDocuments.restore();
        contactModel.find.restore();
    });
});


describe('storeContact', () => {
    let contactController;
    let contactModel;
    let validator;
    let request;
    let response;

    beforeEach(() => {
        contactController = require('../app/controllers/api/contacts/contactsController');
        contactModel = require('../app/models/Contact');
        validator = require('../validators/api/contacts/contactValidator');
        request = {
            body: {
                email: 'johndoe@example.com',
                phone: '1234567890',
                firstName: 'John',
                lastName: 'Doe',
                address: '123 Main Street',
                city: 'Anytown',
                state: 'CA',
                country: 'USA',
                zipCode: '91234'
            }
        };
        response = {
            status: 200,
            json: jest.fn()
        };
    });

    it('should save contact successfully', async () => {
        const newContact = new Contact({
            email: request.body.email,
            phone: request.body.phone,
            firstName: request.body.firstName,
            lastName: request.body.lastName,
            address: request.body.address,
            city: request.body.city,
            state: request.body.state,
            country: request.body.country,
            zipCode: request.body.zipCode
        });

        const validatorResult = validator.validate(newContact);
        expect(validatorResult).toBeTruthy();

        const token = 'Bearer 1234567890';
        request.headers['Authorization'] = token;

        const result = await contactController.storeContact(request, response);

        expect(result.status).toBe(200);
        expect(result.json).toHaveProperty('message');
        expect(result.json.message).toBe('Contact saved successfully');
        expect(result.json).toHaveProperty('data');
        expect(result.json.data).toHaveProperty('contact');
        expect(result.json.data.contact).toEqual(newContact);
    });

    it('should return unauthorized error', async () => {
        request.headers['Authorization'] = 'Bearer invalid-token';

        const result = await contactController.storeContact(request, response);

        expect(result.status).toBe(401);
        expect(result.json).toHaveProperty('message');
        expect(result.json.message).toBe('Unauthorized');
    });

    it('should return validation error', async () => {
        request.body.email = '';

        const validatorResult = validator.validate(newContact);
        expect(validatorResult).toBeFalsy();

        const result = await contactController.storeContact(request, response);

        expect(result.status).toBe(400);
        expect(result.json).toHaveProperty('message');
        expect(result.json.message).toBe('Validation error');
        expect(result.json).toHaveProperty('errors');
        expect(result.json.errors).toHaveProperty('email');
        expect(result.json.errors.email).toHaveProperty('message');
        expect(result.json.errors.email.message).toBe('Email is required');
    });
});
describe('getContact', () => {
    let contactController;
    let contactModel;
    let validator;
    let request;
    let response;

    beforeEach(() => {
        contactController = require('../app/controllers/api/contacts/contactsController');
        contactModel = require('../app/models/Contact');
        validator = require('../validators/api / contacts / contactValidator');
        request = {
            params: {
                id: '1234567890'
            }
        };
        response = {
            status: 200,
            json: jest.fn()
        };
    });

    it('should fetch contact successfully', async () => {
        const contact = new Contact({
            _id: '1234567890',
            email: 'johndoe@example.com',
            phone: '1234567890',
            firstName: 'John',
            lastName: 'Doe',
            address: '123 Main Street',
            city: 'Anytown',
            state: 'CA',
            country: 'USA',
            zipCode: '91234'
        });

        contactModel.findById.mockReturnValue(Promise.resolve(contact));

        const token = 'Bearer 1234567890';
        request.headers['Authorization'] = token;

        const result = await contactController.getContact(request, response);

        expect(result.status).toBe(200);
        expect(result.json).toHaveProperty('message');
        expect(result.json.message).toBe('Contact fetched successfuly');
        expect(result.json).toHaveProperty('data');
        expect(result.json.data).toHaveProperty('contact');
        expect(result.json.data.contact).toEqual(contact);
    });

    it('should return unauthorized error', async () => {
        request.headers['Authorization'] = 'Bearer invalid-token';

        const result = await contactController.getContact(request, response);

        expect(result.status).toBe(401);
        expect(result.json).toHaveProperty('message');
        expect(result.json.message).toBe('Unauthorized');
    });

    it('should return not found error', async () => {
        contactModel.findById.mockReturnValue(Promise.resolve(null));

        const result = await contactController.getContact(request, response);

        expect(result.status).toBe(404);
        expect(result.json).toHaveProperty('message');
        expect(result.json.message).toBe('No contact found');
    });
});
describe('updateContact', () => {
    let contactController;
    let contactModel;
    let validator;
    let request;
    let response;

    beforeEach(() => {
        contactController = require('../app/controllers/api/contacts/contactsController');
        contactModel = require('../app/models/Contact');
        validator = require('../validators/api / contacts / contactValidator');
        request = {
            params: {
                id: '1234567890'
            },
            body: {
                firstName: 'Jane'
            }
        };
        response = {
            status: 200,
            json: jest.fn()
        };
    });

    it('should update contact successfully', async () => {
        const contact = new Contact({
            _id: '1234567890',
            email: 'johndoe@example.com',
            phone: '1234567890',
            firstName: 'John',
            lastName: 'Doe',
            address: '123 Main Street',
            city: 'Anytown',
            state: 'CA',
            country: 'USA',
            zipCode: '91234'
        });

        const updatedContact = contactModel.findByIdAndUpdate(
            { _id: id },
            { $set: request.body },
            { new: true }
        );

        const validatorResult = validator.validate(updatedContact);
        expect(validatorResult).toBeTruthy();

        const token = 'Bearer 1234567890';
        request.headers['Authorization'] = token;

        const result = await contactController.updateContact(request, response);

        expect(result.status).toBe(200);
        expect(result.json).toHaveProperty('message');
        expect(result.json.message).toBe('Contact updated successfully');
        expect(result.json).toHaveProperty('data');
        expect(result.json.data).toHaveProperty('contact');
        expect(result.json.data.contact).toEqual(updatedContact);
    });

    it('should return unauthorized error', async () => {
        request.headers['Authorization'] = 'Bearer invalid-token';

        const result = await contactController.updateContact(request, response);

        expect(result.status).toBe(401);
        expect(result.json).toHaveProperty('message');
        expect(result.json.message).toBe('Unauthorized');
    });

    it('should return not found error', async () => {
        contactModel.findById.mockReturnValue(null);

        const result = await contactController.updateContact(request, response);

        expect(result.status).toBe(404);
        expect(result.json).toHaveProperty('message');
        expect(result.json.message).toBe('Contact not found');
    });

    it('should return validation error', async () => {
        request.body.firstName = '';

        const validatorResult = validator.validate(request.body);
        expect(validatorResult).toBeFalsy();

        const result = await contactController.updateContact(request, response);

        expect(result.status).toBe(400);
        expect(result.json).toHaveProperty('message');
        expect(result.json.message).toBe('Validation error');
        expect(result.json).toHaveProperty('errors');
        expect(result.json.errors).toHaveProperty('firstName');
        expect(result.json.errors.firstName).toHaveProperty('message');
        expect(result.json.errors.firstName.message).toBe('First name is required');
    });
});
describe('deleteContact', () => {
    let contactController;
    let contactModel;
    let validator;
    let request;
    let response;

    beforeEach(() => {
        contactController = require('../app/controllers/api/contacts/contactsController');
        contactModel = require('../app/models/Contact');
        validator = require('../validators/api/contacts/contactValidator');
        request = {
            params: {
                id: '1234567890'
            }
        };
        response = {
            status: 200,
            json: jest.fn()
        };
    });

    it('should delete contact successfully', async () => {
        const contact = new Contact({
            _id: '1234567890',
            email: 'johndoe@example.com',
            phone: '1234567890',
            firstName: 'John',
            lastName: 'Doe',
            address: '123 Main Street',
            city: 'Anytown',
            state: 'CA',
            country: 'USA',
            zipCode: '91234'
        });

        contactModel.findById.mockReturnValue(contact);

        const token = 'Bearer 1234567890';
        request.headers['Authorization'] = token;

        const result = await contactController.deleteContact(request, response);

        expect(result.status).toBe(200);
        expect(result.json).toHaveProperty('message');
        expect(result.json.message).toBe('Contact deleted!');
        expect(result.json).toHaveProperty('data');
        expect(result.json.data).toBe(null);
    });

    it('should return unauthorized error', async () => {
        request.headers['Authorization'] = 'Bearer invalid-token';

        const result = await contactController.deleteContact(request, response);

        expect(result.status).toBe(401);
        expect(result.json).toHaveProperty('message');
        expect(result.json.message).toBe('Unauthorized');
    });

    it('should return not found error', async () => {
        contactModel.findById.mockReturnValue(null);

        const result = await contactController.deleteContact(request, response);

        expect(result.status).toBe(404);
        expect(result.json).toHaveProperty('message');
        expect(result.json.message).toBe('Contact not found');
    });
});
