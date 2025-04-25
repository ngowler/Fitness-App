/**
 * @interface Exercise
 * @description Represents an exercise object.
 * 
 * @openapi
 * components:
 *   schemas:
 *     Exercise:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The unique identifier for an exercise (optional).
 *         workoutId:
 *           type: string
 *           description: The unique identifier for the workout associated with the exercise.
 *         userId:
 *           type: string
 *           description: The unique identifier for the user associated with the exercise.
 *         name:
 *           type: string
 *           description: The name of the exercise.
 *         equipment:
 *           type: array
 *           items:
 *             type: string
 *           description: A list of equipment required for the exercise.
 *         musclesWorked:
 *           type: array
 *           items:
 *             type: string
 *           description: A list of muscles targeted by the exercise.
 *         intensity:
 *           type: string
 *           enum:
 *             - Low
 *             - Medium
 *             - High
 *           description: The intensity level of the exercise.
 *         sets:
 *           type: number
 *           description: The number of sets for the exercise (optional).
 *         reps:
 *           type: number
 *           description: The number of repetitions per set for the exercise (optional).
 */
export type Exercise = {
    id?: string; // Optional identifier for the exercise
    workoutId?: string; // Identifier for the workout associated with the exercise
    userId: string; // Identifier for the user associated with the exercise
    name: string; // Name of the exercise
    equipment: string[]; // List of required equipment
    musclesWorked: string[]; // List of targeted muscles
    intensity: "Low" | "Medium" | "High"; // Exercise intensity
    sets?: number; // Optional sets for the exercise
    reps?: number; // Optional repetitions per set
};
