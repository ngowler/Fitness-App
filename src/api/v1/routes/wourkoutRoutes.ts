import express, { Router } from "express";

const router: Router = express.Router();

// Create a new workout
router.post("/");
// retrieve all workouts for the authenticated user
router.get("/");
// Retrive a specific workout by ID
router.get("/:id");
// Edit a workout
router.put("/:id");
// Delete a workout
router.delete("/:id");

export default router;
