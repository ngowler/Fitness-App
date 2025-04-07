/**
 * @interface Question
 * @description Represents a question object exchanged between users and trainers.
 * 
 * @openapi
 * components:
 *   schemas:
 *     Question:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The unique identifier for the question (optional).
 *         userId:
 *           type: string
 *           description: The unique identifier for the user who asked the question.
 *         trainerId:
 *           type: string
 *           description: The unique identifier for the trainer who responded to the question (optional).
 *         question:
 *           type: string
 *           description: The content of the question asked by the user.
 *         response:
 *           type: string
 *           description: The content of the response provided by the trainer (optional).
 *         dateAsked:
 *           type: string
 *           format: date-time
 *           description: The date and time when the question was asked.
 *         dateResponded:
 *           type: string
 *           format: date-time
 *           description: The date and time when the trainer responded to the question (optional).
 */
export type Question = {
    id?: string;
    userId: string;
    trainerId?: string;
    question: string;
    response?: string;
    dateAsked: string;
    dateResponded?: string;
};
