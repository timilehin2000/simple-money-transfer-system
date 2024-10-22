import Joi from 'joi';

export const initiateTransferSchema = Joi.object({
    username: Joi.string().required().min(5).messages({
        'string.base': `"username" should be a type of 'string'`,
        'string.empty': `"username" cannot be an empty field`,
        'any.required': '"username" is required',
    }),

    amount: Joi.number().required().messages({
        'string.base': `"amount" should be a type of 'number'`,
        'any.required': 'amount is required',
        'number.empty': `"amount" cannot be an empty field`,
    }),

    description: Joi.string().optional().messages({
        'string.base': `"description" should be of type 'string'`,
    }),
});

export const getUsersTransferQuerySchema = Joi.object({
    transferType: Joi.string().valid('CREDIT', 'DEBIT').optional(),

    fromDate: Joi.date().iso().optional(),

    toDate: Joi.date().iso().min(Joi.ref('fromDate')).optional(),

    minAmount: Joi.number().min(0).optional(),

    maxAmount: Joi.number().min(Joi.ref('minAmount')).optional(),

    page: Joi.number().integer().min(1).default(1),

    limit: Joi.number().integer().min(1).max(100).default(10),
}).messages({
    'date.min': 'toDate must be greater than fromDate',
    'number.min': 'maxAmount must be greater than minAmount',
    'any.required': '{{#label}} is required',
    'number.base': '{{#label}} must be a number',
    'date.base': '{{#label}} must be a valid date',
});
