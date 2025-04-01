import express, { Router } from "express";

const router: Router = express.Router();

// Create new exercises for the global library
router.post("/");
// Retrieve details of all exercises (implement query params for filtering)
router.get("/");
// Retrieve details of a specific exercise
router.get("/:id");
// Update exercises in the library
router.put("/:id");
// Remove an exercise from the library
router.delete("/:id");

export default router;
