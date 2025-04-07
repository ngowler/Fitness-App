import express, { Router } from "express";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";
import {
    createExercise,
    getAllExercises,
    getExerciseById,
    updateExercise,
    deleteExercise,
} from "../controllers/exerciseController";
import { validateRequest } from "../middleware/validate";
import {
    postExerciseSchema,
    getExercisesByWorkoutSchema,
    getExerciseByIdSchema,
    putExerciseSchema,
    deleteExerciseSchema,
} from "../validations/exerciseValidation";

const router: Router = express.Router();

// Create a new exercise for a workout
router.post(
    "/",
    authenticate,
    isAuthorized({ hasRole: ["lite", "premium", "trainer"] }),
    validateRequest(postExerciseSchema),
    createExercise
);

// Retrieve all exercises for a specific workout (implement query param ?workoutId=)
router.get(
    "/",
    authenticate,
    isAuthorized({ hasRole: ["lite", "premium", "trainer"] }),
    validateRequest(getExercisesByWorkoutSchema),
    getAllExercises
);

// Retrieve a specific exercise by ID
router.get(
    "/:id",
    authenticate,
    isAuthorized({ hasRole: ["lite", "premium", "trainer"] }),
    validateRequest(getExerciseByIdSchema),
    getExerciseById
);

// Update an exercise from a workout
router.put(
    "/:id",
    authenticate,
    isAuthorized({ hasRole: ["lite", "premium", "trainer"] }),
    validateRequest(putExerciseSchema),
    updateExercise
);

// Remove an exercise from a workout
router.delete(
    "/:id",
    authenticate,
    isAuthorized({ hasRole: ["lite", "premium", "trainer"] }),
    validateRequest(deleteExerciseSchema),
    deleteExercise
);

export default router;
