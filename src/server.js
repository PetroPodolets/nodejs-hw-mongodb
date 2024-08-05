import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import contactRouter from './routers/contacts.js'
import errorHandler from './middlewares/errorHandler.js';
import notFoundHanler from './middlewares/notFoundHandler.js';

export const setupServer = () => {
    const app = express();

    const PORT = ("PORT", "3000")
    app.use(express.json());
    app.use(cors())

    app.use(
        pino()
    )

    app.use(contactRouter);

    app.use(errorHandler);
    app.use(notFoundHanler);

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}
