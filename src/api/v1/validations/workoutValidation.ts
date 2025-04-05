import Joi, { ObjectSchema } from "joi";

export const exerciseSchema: ObjectSchema = Joi.object({
    id: Joi.string().optional().messages({
        "string.empty": "Exercise ID cannot be empty",
    }),
    workoutId: Joi.string().required().messages({
        "any.required": "Workout ID is required",
        "string.empty": "Workout ID cannot be empty",
    }),
    name: Joi.string().required().messages({
        "any.required": "Exercise name is required",
        "string.empty": "Exercise name cannot be empty",
    }),
    equipment: Joi.array().items(Joi.string()).required().messages({
        "any.required": "Equipment is required",
        "array.base": "Equipment must be an array of strings",
    }),
    musclesWorked: Joi.array().items(Joi.string()).required().messages({
        "any.required": "Muscles worked are required",
        "array.base": "Muscles worked must be an array of strings",
    }),
    intensity: Joi.string()
        .valid("Low", "Medium", "High")
        .required()
        .messages({
            "any.required": "Intensity is required",
            "any.only": "Intensity must be 'Low', 'Medium', or 'High'",
        }),
    duration: Joi.number().optional().messages({
        "number.base": "Duration must be a number",
    }),
    reps: Joi.number().optional().messages({
        "number.base": "Reps must be a number",
    }),
});

export const postWorkoutSchema: ObjectSchema = Joi.object({
    userId: Joi.string().required().messages({
        "any.required": "User ID is required",
        "string.empty": "User ID cannot be empty",
    }),
    name: Joi.string().required().messages({
        "any.required": "Workout name is required",
        "string.empty": "Workout name cannot be empty",
    }),
    description: Joi.string().optional().messages({
        "string.empty": "Description cannot be empty",
    }),
    date: Joi.string().isoDate().required().messages({
        "any.required": "Date is required",
        "date.format": "Date must be in ISO 8601 format",
    }),
    exercises: Joi.array().items(exerciseSchema).required().messages({
        "any.required": "Exercises are required",
        "array.base": "Exercises must be an array of valid Exercise objects",
    }),
});

export const getWorkoutsByUserSchema: ObjectSchema = Joi.object({
    userId: Joi.string().required().messages({
        "any.required": "User ID is required",
        "string.empty": "User ID cannot be empty",
    }),
});

export const getWorkoutByIdSchema: ObjectSchema = Joi.object({
    id: Joi.string().required().messages({
        "any.required": "Workout ID is required",
        "string.empty": "Workout ID cannot be empty",
    }),
});

export const putWorkoutSchema: ObjectSchema = Joi.object({
    id: Joi.string().required().messages({
        "any.required": "Workout ID is required",
        "string.empty": "Workout ID cannot be empty",
    }),
    userId: Joi.string().optional().messages({
        "string.empty": "User ID cannot be empty",
    }),
    name: Joi.string().optional().messages({
        "string.empty": "Workout name cannot be empty",
    }),
    description: Joi.string().optional().messages({
        "string.empty": "Description cannot be empty",
    }),
    date: Joi.string().isoDate().optional().messages({
        "date.format": "Date must be in ISO 8601 format",
    }),
    exercises: Joi.array().items(Joi.string()).optional().messages({
        "array.base": "Exercises must be an array of strings",
    }),
});

export const deleteWorkoutSchema: ObjectSchema = Joi.object({
    id: Joi.string().required().messages({
        "any.required": "Workout ID is required",
        "string.empty": "Workout ID cannot be empty",
    }),
});
