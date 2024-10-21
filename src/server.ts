import http from 'http';
import dotenv from 'dotenv';
import app from './app';
import { ConnectDb } from './db/connectDb';

dotenv.config();

const server = http.createServer(app);

const port = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await ConnectDb();

        server.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.error('Failed to start the server:', error);
        process.exit(1);
    }
};

startServer();
