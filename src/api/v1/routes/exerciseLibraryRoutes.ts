import express, { Router } from "express";
import {
    createExercise,
    getAllExercises,
    getExerciseById,
    updateExercise,
    deleteExercise,
    } from "../controllers/exerciseLibraryController"
import { validateRequest } from "../middleware/validate";
import {
    postExerciseLibrarySchema,
    getFilteredExercisesSchema,
    getExerciseLibraryByIdSchema,
    putExerciseLibrarySchema,
    deleteExerciseLibrarySchema, }
    from "../validations/exerciseLibraryValidation";

const router: Router = express.Router();

// Create new exercises for the global library
router.post("/", validateRequest(postExerciseLibrarySchema), createExercise);
// Retrieve details of all exercises (implement query params for filtering)
router.get("/", validateRequest(getFilteredExercisesSchema), getAllExercises);
// Retrieve details of a specific exercise
router.get("/:id", validateRequest(getExerciseLibraryByIdSchema), getExerciseById);
// Update exercises in the library
router.put("/:id", validateRequest(putExerciseLibrarySchema), updateExercise);
// Remove an exercise from the library
router.delete("/:id", validateRequest(deleteExerciseLibrarySchema), deleteExercise);

export default router;
