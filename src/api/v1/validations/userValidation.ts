import Joi, { ObjectSchema } from "joi";

export const postUserSchema: ObjectSchema = Joi.object({
    name: Joi.string().required().messages({
        "any.required": "Name is required",
        "string.empty": "Name cannot be empty",
    }),
    email: Joi.string().email().required().messages({
        "any.required": "Email is required",
        "string.empty": "Email cannot be empty",
        "string.email": "Email must be valid",
    }),
    role: Joi.string()
        .valid("Lite", "Premium", "Trainer", "Admin")
        .required()
        .messages({
            "any.required": "Role is required",
            "any.only": "Role must be one of 'Lite', 'Premium', 'Trainer', or 'Admin'",
        }),
    healthMetrics: Joi.object({
        weight: Joi.number().positive().required().messages({
            "any.required": "Weight is required",
            "number.positive": "Weight must be a positive number",
        }),
        height: Joi.number().positive().required().messages({
            "any.required": "Height is required",
            "number.positive": "Height must be a positive number",
        }),
        bodyFatPercentage: Joi.number().optional(),
        injuriesOrLimitations: Joi.array().items(Joi.string()).optional(),
    }),
    workoutPreferences: Joi.object({
        daysAvailable: Joi.array().items(Joi.string()).required().messages({
            "any.required": "Days available are required",
            "array.base": "Days must be an array of strings",
        }),
        timePerDay: Joi.number().positive().required().messages({
            "any.required": "Time per day is required",
            "number.positive": "Time must be a positive number",
        }),
        gymAccess: Joi.boolean().required().messages({
            "any.required": "Gym access is required",
            "boolean.base": "Gym access must be a boolean",
        }),
        equipment: Joi.array().items(Joi.string()).optional(),
    }),
    background: Joi.object({
        experience: Joi.string().required().messages({
            "any.required": "Experience is required",
        }),
        routine: Joi.string().required().messages({
            "any.required": "Routine is required",
        }),
        goals: Joi.string().required().messages({
            "any.required": "Goals are required",
        }),
    }),
});

export const getUserByIdSchema: ObjectSchema = Joi.object({
    id: Joi.string().required().messages({
        "any.required": "User ID is required",
        "string.empty": "User ID cannot be empty",
    }),
});

export const putUserSchema: ObjectSchema = Joi.object({
    id: Joi.string().required().messages({
        "any.required": "User ID is required",
        "string.empty": "User ID cannot be empty",
    }),
    name: Joi.string().optional().messages({
        "string.empty": "Name cannot be empty",
    }),
    email: Joi.string().email().optional().messages({
        "string.email": "Email must be valid",
    }),
    role: Joi.string()
        .valid("Lite", "Premium", "Trainer", "Admin")
        .optional()
        .messages({
            "any.only": "Role must be one of 'Lite', 'Premium', 'Trainer', or 'Admin'",
        }),
    healthMetrics: Joi.object({
        weight: Joi.number().positive().optional(),
        height: Joi.number().positive().optional(),
        bodyFatPercentage: Joi.number().optional(),
        injuriesOrLimitations: Joi.array().items(Joi.string()).optional(),
    }),
    workoutPreferences: Joi.object({
        daysAvailable: Joi.array().items(Joi.string()).optional(),
        timePerDay: Joi.number().positive().optional(),
        gymAccess: Joi.boolean().optional(),
        equipment: Joi.array().items(Joi.string()).optional(),
    }),
    background: Joi.object({
        experience: Joi.string().optional(),
        routine: Joi.string().optional(),
        goals: Joi.string().optional(),
    }),
});

export const deleteUserSchema: ObjectSchema = Joi.object({
    id: Joi.string().required().messages({
        "any.required": "User ID is required",
        "string.empty": "User ID cannot be empty",
    }),
});

export const upgradeUserRoleSchema: ObjectSchema = Joi.object({
    id: Joi.string().required().messages({
        "any.required": "User ID is required",
        "string.empty": "User ID cannot be empty",
    }),
    role: Joi.string()
        .valid("Lite", "Premium", "Trainer", "Admin")
        .required()
        .messages({
            "any.required": "Role is required",
            "any.only": "Role must be one of 'Lite', 'Premium', 'Trainer', or 'Admin'",
        }),
});
