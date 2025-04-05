import Joi, { ObjectSchema } from "joi";

export const postExerciseLibrarySchema: ObjectSchema = Joi.object({
    name: Joi.string().required().messages({
        "any.required": "Exercise name is required",
        "string.empty": "Exercise name cannot be empty",
    }),
    equipment: Joi.array().items(Joi.string()).required().messages({
        "any.required": "Equipment is required",
        "array.includes": "Equipment items must be strings",
        "array.base": "Equipment must be an array",
    }),
    musclesWorked: Joi.array().items(Joi.string()).required().messages({
        "any.required": "Muscles worked are required",
        "array.includes": "Muscles worked must be strings",
        "array.base": "Muscles worked must be an array",
    }),
    intensity: Joi.string()
        .valid("Low", "Medium", "High")
        .required()
        .messages({
            "any.only": "Intensity must be one of 'Low', 'Medium', or 'High'",
            "any.required": "Intensity is required",
        }),
});

export const getFilteredExercisesSchema: ObjectSchema = Joi.object({
    equipment: Joi.string().optional().messages({
        "string.empty": "Equipment filter cannot be empty",
    }),
    musclesWorked: Joi.string().optional().messages({
        "string.empty": "Muscles worked filter cannot be empty",
    }),
    intensity: Joi.string()
        .valid("Low", "Medium", "High")
        .optional()
        .messages({
            "any.only": "Intensity filter must be one of 'Low', 'Medium', or 'High'",
        }),
});

export const getExerciseLibraryByIdSchema: ObjectSchema = Joi.object({
    id: Joi.string().required().messages({
        "any.required": "Exercise ID is required",
        "string.empty": "Exercise ID cannot be empty",
    }),
});

export const putExerciseLibrarySchema: ObjectSchema = Joi.object({
    id: Joi.string().required().messages({
        "any.required": "Exercise ID is required",
        "string.empty": "Exercise ID cannot be empty",
    }),
    name: Joi.string().optional().messages({
        "string.empty": "Exercise name cannot be empty",
    }),
    equipment: Joi.array().items(Joi.string()).optional().messages({
        "array.includes": "Equipment items must be strings",
        "array.base": "Equipment must be an array",
    }),
    musclesWorked: Joi.array().items(Joi.string()).optional().messages({
        "array.includes": "Muscles worked must be strings",
        "array.base": "Muscles worked must be an array",
    }),
    intensity: Joi.string()
        .valid("Low", "Medium", "High")
        .optional()
        .messages({
            "any.only": "Intensity must be one of 'Low', 'Medium', or 'High'",
        }),
});

export const deleteExerciseLibrarySchema: ObjectSchema = Joi.object({
    id: Joi.string().required().messages({
        "any.required": "Exercise ID is required",
        "string.empty": "Exercise ID cannot be empty",
    }),
});
