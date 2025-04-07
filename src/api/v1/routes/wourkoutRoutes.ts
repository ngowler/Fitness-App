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

// Create a new workout
router.post(
    "/",
    authenticate,
    isAuthorized({ hasRole: ["lite", "premium", "trainer"] }),
    validateRequest(postWorkoutSchema),
    createWorkout
);

// Retrieve all workouts for the authenticated user
router.get(
    "/",
    authenticate,
    isAuthorized({ hasRole: ["trainer"], allowSameUser: true }),
    validateRequest(getWorkoutsByUserSchema),
    getAllWorkouts
);

// Retrieve a specific workout by ID
router.get(
    "/:id",
    authenticate,
    isAuthorized({ hasRole: ["trainer"], allowSameUser: true }),
    validateRequest(getWorkoutByIdSchema),
    getWorkoutById
);

// Edit a workout
router.put(
    "/:id",
    authenticate,
    isAuthorized({ hasRole: ["trainer"], allowSameUser: true }),
    validateRequest(putWorkoutSchema),
    updateWorkout
);

// Delete a workout
router.delete(
    "/:id",
    authenticate,
    isAuthorized({ hasRole: ["trainer"], allowSameUser: true }),
    validateRequest(deleteWorkoutSchema),
    deleteWorkout
);

export default router;
