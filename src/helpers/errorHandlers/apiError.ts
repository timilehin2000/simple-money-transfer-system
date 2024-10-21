import { CustomError } from './customError';

export class NotFoundError extends CustomError {
    constructor(message?: string) {
        super(message || 'Resource not found', 404);
        this.name = 'NotFoundError';
    }
}

export class BadRequestError extends CustomError {
    constructor(message: string) {
        super(message, 400);
        this.name = 'BadRequestError';
    }
}

export class UnauthorizedError extends CustomError {
    constructor(message?: string) {
        super(message || 'Unauthorized to perform this action', 401);
        this.name = 'Unauthorized';
    }
}

export class InternalServerError extends CustomError {
    constructor(message?: string) {
        super(message || 'Internal Server error', 500);
        this.name = 'InternalServerError';
    }
}
