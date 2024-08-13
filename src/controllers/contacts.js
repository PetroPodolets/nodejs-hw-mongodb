import createHttpError from 'http-errors';
import { getAllContacts, getContactById, patchContact, addContact, deleteContact } from '../services/contacts.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { contactFieldList } from '../constants/index.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';

export const getAllContactsController = async (req, res, next) => {
    try {
        const { page, perPage } = parsePaginationParams(req.query);
        const { sortBy, sortOrder } = parseSortParams(req.query, contactFieldList);
        const filter = parseFilterParams(req.query);

        const contacts = await getAllContacts({
            page,
            perPage,
            sortBy,
            sortOrder,
            filter,
            userId: req.user._id,
        });

        res.status(200).json({
            status: 200,
            message: "Successfully found contacts!",
            data: contacts,
        });
    } catch (error) {
        next(createHttpError(500, error.message));
    }
};

export const getContactByIdController = async (req, res, next) => {
    try {
        const { contactId } = req.params;
        console.log(`Received request to get contact with ID: ${contactId}`);
        const contact = await getContactById(contactId, req.user._id);

        if (!contact) {
            return next(createHttpError(404, 'Contact not found'));
        }
        res.status(200).json({
            status: 200,
            message: `Successfully found contact with id ${contactId}!`,
            data: contact,
        });
    } catch (error) {
        console.error(`Error in getContactByIdController: ${error.message}`);
        next(createHttpError(500, 'Internal Server Error'));
    }
};


export const addContactController = async (req, res) => {
    const { _id: userId } = req.user;

    try {
        const contact = await addContact({ ...req.body, userId });
        res.status(201).json({
            status: 201,
            message: 'Successfully created a contact!',
            data: contact,
        });
    } catch (error) {
        console.error('Error creating contact:', error);
        res.status(500).json({
            status: 500,
            message: 'Internal Server Error',
        });
    }
};

export const patchContactController = async (req, res) => {
    const { _id: userId } = req.user;
    const { contactId } = req.params;

    try {
        const result = await patchContact(contactId, userId, req.body);

        if (!result) {
            throw createHttpError(404, 'Contact not found');
        }

        res.json({
            status: 200,
            message: 'Successfully patched contact!',
            data: result,
        });
    } catch (error) {
        console.error('Error in patchContactController:', error);
        res.status(error.status || 500).json({
            status: error.status || 500,
            message: 'Something went wrong',
            data: error.message,
        });
    }
};

export const deleteContactController = async (req, res, next) => {
    const { _id: userId } = req.user;

    const { contactId } = req.params;

    try {
        const contact = await deleteContact(contactId, userId);

        if (!contact) {
            return next(createHttpError(404, 'Contact not found'));
        }

        res.status(204).send();
    } catch (error) {
        console.error('Error in deleteContactController:', error);
        next(createHttpError(500, 'Internal Server Error'));
    }
};
