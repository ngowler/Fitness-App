import express, { Router } from "express";

const router: Router = express.Router();

// Submit a new question to a trainer
router.post("/");
// Retrieve all questions asked by the authenticated user
router.get("/");
// Retrieve a specific question by ID
router.get("/:id");
// Respond to a question (Trainer)
router.put("/:id");

export default router;
