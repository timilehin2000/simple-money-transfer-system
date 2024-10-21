import { Response } from 'express';

export const successResponse = (
    res: Response,
    message: string,
    data?: Object | Array<Object>,
    statusCode = 200,
) => {
    return res.status(statusCode).json({
        status: true,
        message,
        data,
    });
};

export const errorResponse = (
    res: Response,
    message: string,
    statusCode = 500,
) => {
    return res.status(statusCode).json({
        status: false,
        message,
    });
};
