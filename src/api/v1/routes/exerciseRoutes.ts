import express, { Router } from "express";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";
import {
    createExercise,
    getAllExercises,
    updateExercise,
    deleteExercise,
} from "../controllers/exerciseController";
import { validateRequest } from "../middleware/validate";
import {
    postExerciseSchema,
    getExercisesByWorkoutSchema,
    putExerciseSchema,
    deleteExerciseSchema,
} from "../validations/exerciseValidation";

const router: Router = express.Router();

/**
 * @route POST /exercise
 * @description Create a new exercise for a workout.
 * 
 * @openapi
 * /exercise:
 *   post:
 *     summary: Create a new exercise
 *     tags: [Exercise]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Exercise'
 *     responses:
 *       201:
 *         description: Exercise created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Exercise'
 *       400:
 *         description: Invalid input provided
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Server error
 */
router.post(
    "/",
    authenticate,
    isAuthorized({ allowSameUser: true, hasRole: ["trainer"] }),
    validateRequest(postExerciseSchema),
    createExercise
);

/**
 * @route GET /exercise/:workoutId
 * @description Retrieve all exercises for a specific workout by workout ID.
 * 
 * @openapi
 * /exercise/{workoutId}:
 *   get:
 *     summary: Retrieve all exercises in a workout
 *     tags: [Exercise]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: workoutId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the workout to retrieve exercises for
 *     responses:
 *       200:
 *         description: Exercises retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Exercise'
 *       401:
 *         description: Unauthorized access
 *       403:
 *         description: Forbidden due to insufficient permissions
 *       500:
 *         description: Server error
 */
router.get(
    "/:workoutId?",
    authenticate,
    isAuthorized({ allowSameUser: true, hasRole: ["trainer"] }),
    validateRequest(getExercisesByWorkoutSchema),
    getAllExercises
);

/**
 * @route PUT /exercise/{id}
 * @description Update an exercise for a workout.
 * 
 * @openapi
 * /exercise/{id}:
 *   put:
 *     summary: Update an exercise
 *     tags: [Exercise]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the exercise to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Exercise'
 *     responses:
 *       200:
 *         description: Exercise updated successfully
 *       400:
 *         description: Invalid input provided
 *       404:
 *         description: Exercise not found
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Server error
 */
router.put(
    "/:id",
    authenticate,
    isAuthorized({ allowSameUser: true, hasRole: ["trainer"] }),
    validateRequest(putExerciseSchema),
    updateExercise
);

/**
 * @route DELETE /exercise/{id}
 * @description Remove an exercise from a workout.
 * 
 * @openapi
 * /exercise/{id}:
 *   delete:
 *     summary: Delete an exercise
 *     tags: [Exercise]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the exercise to delete
 *     responses:
 *       200:
 *         description: Exercise deleted successfully
 *       404:
 *         description: Exercise not found
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Server error
 */
router.delete(
    "/:id",
    authenticate,
    isAuthorized({ allowSameUser: true, hasRole: ["trainer"] }),
    validateRequest(deleteExerciseSchema),
    deleteExercise
);

export default router;
