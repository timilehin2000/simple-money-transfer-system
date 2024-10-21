import Joi from 'joi';

export const registerUserSchema = Joi.object({
    username: Joi.string().required().min(5).messages({
        'any.required': 'username is required',
    }),

    firstName: Joi.string().required().messages({
        'any.required': 'firstName is required',
    }),

    lastName: Joi.string().required().messages({
        'any.required': 'lastName is required',
    }),

    password: Joi.string()
        .min(8)
        .max(30)
        .pattern(
            new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*]).+$'),
        )
        .required()
        .messages({
            'string.min': `Password should have a minimum length of 8`,
            'string.max': `Password should have a maximum length of 30`,
            'string.pattern.base': `Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character`,
            'any.required': `Password is a required field`,
        }),
});

export const getUserDetailsSchema = Joi.object({
    username: Joi.string().required().messages({
        'any.required': 'username is required',
    }),
});

export const loginSchema = Joi.object({
    username: Joi.string().required().messages({
        'any.required': 'username is required',
    }),

    password: Joi.string().required().messages({
        'any.required': 'Paswsword is required',
    }),
});
