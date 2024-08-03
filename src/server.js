import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import { contactColection } from './db/models/contact.js'
import mongoose from 'mongoose';

export const setupServer = () => {
    const app = express();

    const PORT = ("PORT", "3000")

    app.use(cors());




    app.use(pino());

    app.get('/contacts', async (req, res) => {
        try {
            const contacts = await contactColection.find();
            res.send(contacts);
            res.status(200).json({
                status: 200,
                message: 'Successfully found contacts!',
                data: contacts,
            });

        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    });

    app.get('/contacts/:contactId', async (req, res) => {
        try {
            const { contactId } = req.params;

            if (!mongoose.Types.ObjectId.isValid(contactId)) {
                return res.status(400).send({ status: 400, message: 'Invalid contact ID' });
            }

            const user = await contactColection.findById(contactId);

            if (!user) {
                return res.status(404).send({ status: 404, message: 'Contact not found' });
            }

            res.status(200).send({
                status: 200,
                message: `Successfully found contact with id ${contactId}!`,
                data: user
            });
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    });


    app.use((req, res) => {
        res.status(404).send('Not found')
    });

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}
