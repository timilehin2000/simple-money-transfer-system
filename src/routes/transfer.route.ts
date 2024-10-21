import { Router } from 'express';
import validatorMiddleware from '../middleware/error/validator.middleware';
import {
    getUsersTransfersHandler,
    initiateTransferHandler,
} from '../controllers';
import {
    initiateTransferSchema,
    getUsersTransferQuerySchema,
} from '../validators/transfer.validator';
import loginRequired from '../middleware/auth/loginRequired';

const transferRoutes = Router();

transferRoutes.post(
    '/',
    loginRequired,
    validatorMiddleware(initiateTransferSchema),
    initiateTransferHandler,
);

transferRoutes.get(
    '/',
    loginRequired,
    validatorMiddleware(getUsersTransferQuerySchema, 'query'),
    getUsersTransfersHandler,
);

// transferRoutes.post('/', validatorMiddleware(loginSchema), login);

export default transferRoutes;
