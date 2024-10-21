import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/user.service';
import * as ApiResponse from '../utils/responseHandler';

export const registerUserHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    const { username, firstName, lastName, password } = req.body;

    try {
        const response = await userService.createUser({
            username,
            firstName,
            lastName,
            password,
        });

        ApiResponse.successResponse(
            res,
            'User created successfully',
            response,
            201,
        );
    } catch (err: any) {
        console.log(err);
        next(err);
    }
};

export const loginHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    const { username, password } = req.body;

    try {
        const response = await userService.login({
            username,
            password,
        });

        ApiResponse.successResponse(res, 'Login successfully', response, 201);
    } catch (err: any) {
        console.log(err);
        next(err);
    }
};

export const getUserDetailsHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    const { username } = req.params;

    try {
        const response = await userService.getUserDetails(username);

        ApiResponse.successResponse(
            res,
            'User details fetched successfully',
            response,
            200,
        );
    } catch (err: any) {
        next(err);
    }
};

export const getUserDetailsWithBalanceHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    const { userId } = req.user;

    try {
        const response = await userService.getUserDetailsWithBalance(userId);

        ApiResponse.successResponse(
            res,
            'User details and balance fetched successfully',
            response,
            200,
        );
    } catch (err: any) {
        next(err);
    }
};
