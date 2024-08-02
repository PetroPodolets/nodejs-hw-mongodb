
import { setupServer } from './server.js';
import { initMongoDB } from './db/initMongoConnection.js';

const bootstrap = async () => {
    try {
        await initMongoDB();
        console.log('Application has started successfully.');
        setupServer()
    } catch (e) {
        console.error('Failed to start application', e);
    }
};

bootstrap();
