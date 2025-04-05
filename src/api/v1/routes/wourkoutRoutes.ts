import express, { Router } from "express";
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
router.post("/", validateRequest(postWorkoutSchema), createWorkout);
// Retrieve all workouts for the authenticated user
router.get("/", validateRequest(getWorkoutsByUserSchema), getAllWorkouts);
// Retrieve a specific workout by ID
router.get("/:workoutId", validateRequest(getWorkoutByIdSchema), getWorkoutById);
// Edit a workout
router.put("/:workoutId", validateRequest(putWorkoutSchema), updateWorkout);
// Delete a workout
router.delete("/:workoutId", validateRequest(deleteWorkoutSchema), deleteWorkout);

export default router;
