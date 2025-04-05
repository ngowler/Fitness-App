import Joi, { ObjectSchema } from "joi";

export const postExerciseSchema: ObjectSchema = Joi.object({
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

export const getExercisesByWorkoutSchema: ObjectSchema = Joi.object({
    workoutId: Joi.string().required().messages({
        "any.required": "Workout ID is required",
        "string.empty": "Workout ID cannot be empty",
    }),
});

export const getExerciseByIdSchema: ObjectSchema = Joi.object({
    id: Joi.string().required().messages({
        "any.required": "Exercise ID is required",
        "string.empty": "Exercise ID cannot be empty",
    }),
});

export const putExerciseSchema: ObjectSchema = Joi.object({
    id: Joi.string().required().messages({
        "any.required": "Exercise ID is required",
        "string.empty": "Exercise ID cannot be empty",
    }),
    workoutId: Joi.string().optional().messages({
        "string.empty": "Workout ID cannot be empty",
    }),
    name: Joi.string().optional().messages({
        "string.empty": "Exercise name cannot be empty",
    }),
    equipment: Joi.array().items(Joi.string()).optional().messages({
        "array.base": "Equipment must be an array of strings",
    }),
    musclesWorked: Joi.array().items(Joi.string()).optional().messages({
        "array.base": "Muscles worked must be an array of strings",
    }),
    intensity: Joi.string()
        .valid("Low", "Medium", "High")
        .optional()
        .messages({
            "any.only": "Intensity must be 'Low', 'Medium', or 'High'",
        }),
    duration: Joi.number().optional().messages({
        "number.base": "Duration must be a number",
    }),
    reps: Joi.number().optional().messages({
        "number.base": "Reps must be a number",
    }),
});

export const deleteExerciseSchema: ObjectSchema = Joi.object({
    id: Joi.string().required().messages({
        "any.required": "Exercise ID is required",
        "string.empty": "Exercise ID cannot be empty",
    }),
});
