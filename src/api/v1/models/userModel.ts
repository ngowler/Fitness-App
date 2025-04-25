/**
 * @interface User
 * @description Represents a user object.
 * 
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The unique identifier for the user (optional).
 *         name:
 *           type: string
 *           description: The name of the user.
 *         email:
 *           type: string
 *           description: The email address of the user.
 *         role:
 *           type: string
 *           enum:
 *             - Lite
 *             - Premium
 *             - Trainer
 *             - Admin
 *           description: The role of the user in the system.
 *         healthMetrics:
 *           type: object
 *           properties:
 *             weight:
 *               type: number
 *               description: The weight of the user in kilograms.
 *             height:
 *               type: number
 *               description: The height of the user in centimeters.
 *             bodyFatPercentage:
 *               type: number
 *               description: The body fat percentage of the user (optional).
 *             injuriesOrLimitations:
 *               type: array
 *               items:
 *                 type: string
 *               description: A list of injuries or limitations the user has (optional).
 *           description: The health metrics of the user.
 *         workoutPreferences:
 *           type: object
 *           properties:
 *             daysAvailable:
 *               type: array
 *               items:
 *                 type: string
 *               description: The days the user is available for workouts.
 *             timePerDay:
 *               type: number
 *               description: The amount of time (in minutes) the user can dedicate to workouts each day.
 *             gymAccess:
 *               type: boolean
 *               description: Whether the user has access to a gym.
 *             equipment:
 *               type: array
 *               items:
 *                 type: string
 *               description: A list of equipment available to the user (optional).
 *           description: The user's workout preferences.
 *         background:
 *           type: object
 *           properties:
 *             experience:
 *               type: string
 *               description: The user's fitness experience.
 *             routine:
 *               type: string
 *               description: The user's current fitness routine.
 *             goals:
 *               type: string
 *               description: The fitness goals of the user.
 *           description: The background information of the user.
 */
export type User = {
    id?: string;
    name: string;
    email: string;
    password?: string;
    role: "Lite" | "Premium" | "Trainer" | "Admin";
    healthMetrics: {
        weight: number;
        height: number;
        bodyFatPercentage?: number;
        injuriesOrLimitations?: string[];
    };
    workoutPreferences: {
        daysAvailable: string[];
        timePerDay: number;
        gymAccess: boolean;
        equipment?: string[];
    };
    background: {
        experience: string;
        routine: string;
        goals: string;
    };
};
