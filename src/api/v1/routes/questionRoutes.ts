import express, { Router } from "express";
import {
    createQuestion,
    getAllQuestions,
    getQuestionById,
    respondToQuestion,
    } from "../controllers/questionController"
import { validateRequest } from "../middleware/validate";
import {
    postQuestionSchema,
    getQuestionsByUserSchema,
    getQuestionByIdSchema,
    putQuestionSchema,
    } from "../validations/questionValidation";

const router: Router = express.Router();

// Submit a new question to a trainer
router.post("/", validateRequest(postQuestionSchema), createQuestion);
// Retrieve all questions asked by the authenticated user
router.get("/", validateRequest(getQuestionsByUserSchema), getAllQuestions);
// Retrieve a specific question by ID
router.get("/:id", validateRequest(getQuestionByIdSchema), getQuestionById);
// Respond to a question (Trainer)
router.put("/:id", validateRequest(putQuestionSchema), respondToQuestion);

export default router;
