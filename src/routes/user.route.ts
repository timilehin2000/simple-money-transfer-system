import { Router } from 'express';
import validatorMiddleware from '../middleware/error/validator.middleware';
import {
    getUserDetailsSchema,
    loginSchema,
    registerUserSchema,
} from '../validators/user.validator';
import {
    getUserDetailsHandler,
    getUserDetailsWithBalanceHandler,
    loginHandler,
    registerUserHandler,
} from '../controllers';
import loginRequired from '../middleware/auth/loginRequired';

const userRoutes = Router();

userRoutes.post(
    '/',
    validatorMiddleware(registerUserSchema),
    registerUserHandler,
);

userRoutes.post('/login', validatorMiddleware(loginSchema), loginHandler);

userRoutes.get('/id', loginRequired, getUserDetailsWithBalanceHandler);

userRoutes.get(
    '/:username',
    validatorMiddleware(getUserDetailsSchema, 'params'),
    getUserDetailsHandler,
);

// userRoutes.post('/', validatorMiddleware(loginSchema), login);

export default userRoutes;
