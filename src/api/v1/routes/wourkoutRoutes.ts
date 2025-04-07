import express, { Router } from "express";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";
import {
    createWorkout,
    getAllWorkouts,
    getWorkoutById,
    updateWorkout,
    deleteWorkout,
} from "../controllers/workoutController";
import { validateRequest } from "../middleware/validate";
import {
    postWorkoutSchema,
    getWorkoutsByUserSchema,
    getWorkoutByIdSchema,
    putWorkoutSchema,
    deleteWorkoutSchema,
} from "../validations/workoutValidation";

const router: Router = express.Router();

/**
 * @route POST /workout
 * @description Create a new workout.
 * 
 * @openapi
 * /workout:
 *   post:
 *     summary: Create a new workout
 *     tags: [Workout]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Workout'
 *     responses:
 *       201:
 *         description: Workout created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Workout'
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
    isAuthorized({ hasRole: ["lite", "premium", "trainer"] }),
    validateRequest(postWorkoutSchema),
    createWorkout
);

/**
 * @route GET /workout
 * @description Retrieve all workouts for the authenticated user.
 * 
 * @openapi
 * /workout:
 *   get:
 *     summary: Get all workouts
 *     tags: [Workout]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Workouts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Workout'
 *       404:
 *         description: No workouts found
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Server error
 */
router.get(
    "/",
    authenticate,
    isAuthorized({ hasRole: ["trainer"], allowSameUser: true }),
    validateRequest(getWorkoutsByUserSchema),
    getAllWorkouts
);

/**
 * @route GET /workout/{id}
 * @description Retrieve details of a specific workout by ID.
 * 
 * @openapi
 * /workout/{id}:
 *   get:
 *     summary: Get a specific workout
 *     tags: [Workout]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the workout to retrieve
 *     responses:
 *       200:
 *         description: Workout retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Workout'
 *       404:
 *         description: Workout not found
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Server error
 */
router.get(
    "/:id",
    authenticate,
    isAuthorized({ hasRole: ["trainer"], allowSameUser: true }),
    validateRequest(getWorkoutByIdSchema),
    getWorkoutById
);

/**
 * @route PUT /workout/{id}
 * @description Update a workout.
 * 
 * @openapi
 * /workout/{id}:
 *   put:
 *     summary: Update a workout
 *     tags: [Workout]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the workout to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Workout'
 *     responses:
 *       200:
 *         description: Workout updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Workout'
 *       400:
 *         description: Invalid input provided
 *       404:
 *         description: Workout not found
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Server error
 */
router.put(
    "/:id",
    authenticate,
    isAuthorized({ hasRole: ["trainer"], allowSameUser: true }),
    validateRequest(putWorkoutSchema),
    updateWorkout
);

/**
 * @route DELETE /workout/{id}
 * @description Delete a workout.
 * 
 * @openapi
 * /workout/{id}:
 *   delete:
 *     summary: Delete a workout
 *     tags: [Workout]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the workout to delete
 *     responses:
 *       200:
 *         description: Workout deleted successfully
 *       404:
 *         description: Workout not found
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Server error
 */
router.delete(
    "/:id",
    authenticate,
    isAuthorized({ hasRole: ["trainer"], allowSameUser: true }),
    validateRequest(deleteWorkoutSchema),
    deleteWorkout
);

export default router;
