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

// Create new exercises for the global library
router.post(
    "/",
    authenticate,
    isAuthorized({ hasRole: ["trainer"] }),
    validateRequest(postExerciseLibrarySchema),
    createExercise
);

// Retrieve details of all exercises (implement query params for filtering)
router.get(
    "/",
    authenticate,
    isAuthorized({ hasRole: ["lite", "premium", "trainer"] }),
    validateRequest(getFilteredExercisesSchema),
    getAllExercises
);

// Retrieve details of a specific exercise
router.get(
    "/:id",
    authenticate,
    isAuthorized({ hasRole: ["lite", "premium", "trainer"] }),
    validateRequest(getExerciseLibraryByIdSchema),
    getExerciseById
);

// Update exercises in the library
router.put(
    "/:id",
    authenticate,
    isAuthorized({ hasRole: ["trainer"] }),
    validateRequest(putExerciseLibrarySchema),
    updateExercise
);

// Remove an exercise from the library
router.delete(
    "/:id",
    authenticate,
    isAuthorized({ hasRole: ["trainer"] }),
    validateRequest(deleteExerciseLibrarySchema),
    deleteExercise
);

export default router;
