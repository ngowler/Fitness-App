/**
 * @interface ExerciseLibrary
 * @description Represents an exercise library object.
 * 
 * @openapi
 * components:
 *   schemas:
 *     ExerciseLibrary:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The unique identifier for an exercise (optional).
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
 */
export type ExerciseLibrary = {
    id?: string;
    name: string;
    equipment: string[];
    musclesWorked: string[];
    intensity: "Low" | "Medium" | "High";
};
