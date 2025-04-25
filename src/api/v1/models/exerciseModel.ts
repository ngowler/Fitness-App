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
    id?: string;
    workoutId?: string;
    userId: string;
    name: string;
    equipment: string[];
    musclesWorked: string[];
    intensity: "Low" | "Medium" | "High";
    sets?: number;
    reps?: number;
};
