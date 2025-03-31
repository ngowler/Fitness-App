import express, { Router } from "express";

const router: Router = express.Router();

// Create a new exercise for a workout
router.post("/");
// Retrieve all exercises for a specific workout (implement query param ?workoutId=)
router.get("/");
// Retrieve a specific exercise by ID
router.get("/:id");
// Update exercise from a workouts
router.put("/:id");
// Remove an exercise from a workout
router.delete("/:id");

export default router;
