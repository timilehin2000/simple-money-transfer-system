import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';

import router from './routes';
import { notFound } from './middleware/error/notFound';
import errorHandler from './middleware/error/errorHandler';

const app: Application = express();

app.use(cors());

app.use(express.json());

app.use(helmet());

app.use(router);

app.use('*', notFound);

app.use(errorHandler);

export default app;
