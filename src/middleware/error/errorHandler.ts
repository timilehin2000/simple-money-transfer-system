import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { CustomError } from '../../helpers/errorHandlers/customError';
import { errorResponse } from '../../utils/responseHandler';
import { QueryFailedError } from 'typeorm';
import { TokenExpiredError } from 'jsonwebtoken';

const errorHandler = (
    err: ErrorRequestHandler,
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
    console.error('Error:', {
        name: err.name,
        message: err instanceof Error ? err.message : 'Unknown error',
        stack: err instanceof Error ? err.stack : undefined,
    });

    let message = 'Something went wrong. Please try again';
    let statusCode = 500;

    if (err instanceof CustomError) {
        message = err.message;
        statusCode = err.statusCode;
    } else if (err instanceof QueryFailedError) {
        if (err.driverError.code === '23505') {
            if (err.driverError.code === '23505') {
                message = err.message;
                statusCode = 400;
            }
        }
    } else if (err instanceof TokenExpiredError) {
        message = 'Unauthorized. Please login';
        statusCode = 401;
    }

    errorResponse(res, message, statusCode);
};

export default errorHandler;
