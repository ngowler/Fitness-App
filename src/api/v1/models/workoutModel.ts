import { Exercise } from "./exerciseModel";

/**
 * @interface Workout
 * @description Represents a workout object.
 * 
 * @openapi
 * components:
 *   schemas:
 *     Workout:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The unique identifier for the workout (optional).
 *         userId:
 *           type: string
 *           description: The unique identifier for the user associated with the workout.
 *         name:
 *           type: string
 *           description: The name of the workout.
 *         description:
 *           type: string
 *           description: A brief description of the workout (optional).
 *         date:
 *           type: string
 *           format: date-time
 *           description: The date and time of the workout.
 *         exercises:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Exercise'
 *           description: A list of exercises included in the workout.
 */
export type Workout = {
    id?: string;
    userId: string;
    name: string;
    description?: string;
    date: string;
    exercises: Exercise[];
};
