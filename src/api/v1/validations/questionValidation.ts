import Joi, { ObjectSchema } from "joi";

export const postQuestionSchema: ObjectSchema = Joi.object({
    userId: Joi.string().required().messages({
        "any.required": "User ID is required",
        "string.empty": "User ID cannot be empty",
    }),
    question: Joi.string().required().messages({
        "any.required": "Question is required",
        "string.empty": "Question cannot be empty",
    }),
});


export const getQuestionsByUserSchema: ObjectSchema = Joi.object({
    userId: Joi.string().required().messages({
        "any.required": "User ID is required",
        "string.empty": "User ID cannot be empty",
    }),
});

export const getQuestionByIdSchema: ObjectSchema = Joi.object({
    id: Joi.string().required().messages({
        "any.required": "Question ID is required",
        "string.empty": "Question ID cannot be empty",
    }),
});

export const putQuestionSchema: ObjectSchema = Joi.object({
    id: Joi.string().required().messages({
        "any.required": "Question ID is required",
        "string.empty": "Question ID cannot be empty",
    }),
    trainerId: Joi.string().required().messages({
        "any.required": "Trainer ID is required",
        "string.empty": "Trainer ID cannot be empty",
    }),
    response: Joi.string().required().messages({
        "any.required": "Response is required",
        "string.empty": "Response cannot be empty",
    }),
});

