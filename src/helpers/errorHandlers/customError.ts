export class CustomError extends Error {
    statusCode: number;
    data?: string | object;

    constructor(message: string, statusCode: number, data?: string | object) {
        super(message);
        this.statusCode = statusCode;
        this.data = data;
        Error.captureStackTrace(this, this.constructor);
    }
}
