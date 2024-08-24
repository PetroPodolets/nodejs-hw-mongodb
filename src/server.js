import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import contactRouter from './routers/contacts.js';
import errorHandler from './middlewares/errorHandler.js';
import notFoundHandler from './middlewares/notFoundHandler.js';
import authRouter from './routers/auth.js';
import { UPLOAD_DIR } from './constants/index.js';
import swaggerDocs from './middlewares/swaggerDocs.js';

export const setupServer = () => {
    const app = express();

    const PORT = process.env.PORT || 3000;


    app.use(express.json());
    app.use(express.static(UPLOAD_DIR))
    app.use(cors());
    app.use(cookieParser());

    app.use(
        pino({
            transport: {
                target: 'pino-pretty',
            },
        }),
    );
    app.use("/api-docs", swaggerDocs())

    app.use(authRouter);
    app.use(contactRouter);

    app.use(notFoundHandler);

    app.use(errorHandler);

    app.listen(PORT, () => {

        console.log(`Server is running on port ${PORT}`);
    });
}
