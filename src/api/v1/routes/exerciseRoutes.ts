import express, { Router } from "express";
import {
    createExercise,
    getAllExercises,
    getExerciseById,
    updateExercise,
    deleteExercise,
    } from "../controllers/exerciseController"
import { validateRequest } from "../middleware/validate";
import {
    postExerciseSchema,
    getExercisesByWorkoutSchema,
    getExerciseByIdSchema,
    putExerciseSchema,
    deleteExerciseSchema, }
    from "../validations/exerciseValidation";

const router: Router = express.Router();

// Create a new exercise for a workout
router.post("/", validateRequest(postExerciseSchema), createExercise);
// Retrieve all exercises for a specific workout (implement query param ?workoutId=)
router.get("/", validateRequest(getExercisesByWorkoutSchema), getAllExercises);
// Retrieve a specific exercise by ID
router.get("/:id", validateRequest(getExerciseByIdSchema), getExerciseById);
// Update exercise from a workouts
router.put("/:id", validateRequest(putExerciseSchema), updateExercise);
// Remove an exercise from a workout
router.delete("/:id", validateRequest(deleteExerciseSchema), deleteExercise);

export default router;
