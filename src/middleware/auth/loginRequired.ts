import { NextFunction, Request, Response } from 'express';
import { JwtPayload, verify } from 'jsonwebtoken';
import {
    NotFoundError,
    UnauthorizedError,
} from '../../helpers/errorHandlers/apiError';
import { verifyToken } from '../../utils/jwt';
import { User } from '../../entities';
import AppDataSource from '../../data-source';

const loginRequired = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const authHeader: string = req.headers['authorization'] || '';

        if (!authHeader) {
            throw new UnauthorizedError('No token Provided');
        }

        const token: string = authHeader.split(' ')[1];

        const decoded: JwtPayload = verifyToken(token);

        const user = await findUser(decoded.username);

        req.user = {
            userId: user.id,
            username: user.username,
        };

        next();
    } catch (err: any) {
        next(err);
    }
};

const findUser = async (username: string) => {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { username } });

    if (!user) {
        throw new NotFoundError('User not found');
    }

    return user;
};

export default loginRequired;
