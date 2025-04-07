import express, { Router } from "express";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";
import {
    createExercise,
    getAllExercises,
    getExerciseById,
    updateExercise,
    deleteExercise,
} from "../controllers/exerciseLibraryController";
import { validateRequest } from "../middleware/validate";
import {
    postExerciseLibrarySchema,
    getFilteredExercisesSchema,
    getExerciseLibraryByIdSchema,
    putExerciseLibrarySchema,
    deleteExerciseLibrarySchema,
} from "../validations/exerciseLibraryValidation";

const router: Router = express.Router();

/**
 * @route POST /exercise-library
 * @description Create new exercises for the global library.
 * 
 * @openapi
 * /exercise-library:
 *   post:
 *     summary: Create new exercises
 *     tags: [ExerciseLibrary]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ExerciseLibrary'
 *     responses:
 *       201:
 *         description: Exercise created successfully
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
    isAuthorized({ hasRole: ["trainer"] }),
    validateRequest(postExerciseLibrarySchema),
    createExercise
);

/**
 * @route GET /exercise-library
 * @description Retrieve details of all exercises with optional filters.
 * 
 * @openapi
 * /exercise-library:
 *   get:
 *     summary: Get all exercises
 *     tags: [ExerciseLibrary]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: filter
 *         schema:
 *           type: string
 *         description: Filtering criteria for the exercises
 *     responses:
 *       200:
 *         description: Exercises retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ExerciseLibrary'
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Server error
 */
router.get(
    "/",
    authenticate,
    isAuthorized({ hasRole: ["lite", "premium", "trainer"] }),
    validateRequest(getFilteredExercisesSchema),
    getAllExercises
);

/**
 * @route GET /exercise-library/{id}
 * @description Retrieve details of a specific exercise.
 * 
 * @openapi
 * /exercise-library/{id}:
 *   get:
 *     summary: Get specific exercise
 *     tags: [ExerciseLibrary]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the exercise to retrieve
 *     responses:
 *       200:
 *         description: Exercise retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ExerciseLibrary'
 *       404:
 *         description: Exercise not found
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Server error
 */
router.get(
    "/:id",
    authenticate,
    isAuthorized({ hasRole: ["lite", "premium", "trainer"] }),
    validateRequest(getExerciseLibraryByIdSchema),
    getExerciseById
);

/**
 * @route PUT /exercise-library/{id}
 * @description Update an exercise in the library.
 * 
 * @openapi
 * /exercise-library/{id}:
 *   put:
 *     summary: Update specific exercise
 *     tags: [ExerciseLibrary]
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
 *             $ref: '#/components/schemas/ExerciseLibrary'
 *     responses:
 *       200:
 *         description: Exercise updated successfully
 *       400:
 *         description: Invalid input provided
 *       401:
 *         description: Unauthorized access
 *       404:
 *         description: Exercise not found
 *       500:
 *         description: Server error
 */
router.put(
    "/:id",
    authenticate,
    isAuthorized({ hasRole: ["trainer"] }),
    validateRequest(putExerciseLibrarySchema),
    updateExercise
);

/**
 * @route DELETE /exercise-library/{id}
 * @description Remove an exercise from the library.
 * 
 * @openapi
 * /exercise-library/{id}:
 *   delete:
 *     summary: Delete specific exercise
 *     tags: [ExerciseLibrary]
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
 *       401:
 *         description: Unauthorized access
 *       404:
 *         description: Exercise not found
 *       500:
 *         description: Server error
 */
router.delete(
    "/:id",
    authenticate,
    isAuthorized({ hasRole: ["trainer"] }),
    validateRequest(deleteExerciseLibrarySchema),
    deleteExercise
);

export default router;
