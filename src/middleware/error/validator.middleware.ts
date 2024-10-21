import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import { BadRequestError } from '../../helpers/errorHandlers/apiError';
// import { errorResponse } from '../../utiils/responses/apiResponses';

const validatorMiddleware = (
    schema: Joi.Schema,
    property: 'body' | 'query' | 'params' = 'body',
): ((req: Request, res: Response, next: NextFunction) => void) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error } = schema.validate(req[property || 'body'], {
            allowUnknown: false,
        });

        if (error !== null && error?.details) {
            const { details }: Joi.ValidationError = error;
            const message = details
                .map((err: Joi.ValidationErrorItem) => err.message)
                .join(',');

            throw new BadRequestError(message);
        }

        next();
    };
};

export default validatorMiddleware;
