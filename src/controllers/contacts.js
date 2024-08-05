import mongoose from 'mongoose';
import createError from 'http-errors';
import { getAllContacts, getContactById, patchContact, addContact, deleteContact } from '../services/contacts.js'
import createHttpError from 'http-errors';

export const getAllContactsController = async (req, res) => {
    try {
        const contacts = await getAllContacts();
        res.status(200).send({
            status: 200,
            message: 'Successfully found contacts!',
            data: contacts,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};


export const getContactByIdController = async (req, res, next) => {
    try {
        const { contactId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(contactId)) {
            return next(createError(400, 'Invalid contact ID'));
        }

        const user = await getContactById(contactId);

        if (!user) {
            return next(createError(404, 'Contact not found'));
        }

        res.status(200).send({
            status: 200,
            message: `Successfully found contact with id ${contactId}!`,
            data: user
        });
    } catch (error) {
        next(createError(500, error.message));
    }
};

export const addContactController = async (req, res) => {
    try {
        const contact = await addContact(req.body);
        res.status(201).json({
            status: 201,
            message: `Successfully created a contact!`,
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
    try {

        const { contactId } = req.params;
        console.log("Patch contact controller with ID:", contactId);
        const result = await patchContact(contactId, req.body);

        if (!result) {
            throw createHttpError(404, "Contact not found");
        }

        res.json({
            status: 200,
            message: `Successfully patched contact!`,
            data: result.data,
        });
    } catch (error) {
        console.error("Error in patchContactController:", error);
        res.status(error.status || 500).json({
            status: error.status || 500,
            message: "Something went wrong",
            data: error.message,
        });
    }
}


export const deleteContactController = async (req, res, next) => {
    const { contactId } = req.params; // Параметри в правильному порядку
    try {
        const contact = await deleteContact(contactId);
        if (!contact) {
            return next(createHttpError(404, 'Contact not found'));
        }
        res.status(204).send(); // Відправка відповіді з кодом 204 (No Content)
    } catch (error) {
        console.error("Error in deleteContactController:", error);
        next(createHttpError(500, 'Internal Server Error')); // Обробка помилок
    }
}

