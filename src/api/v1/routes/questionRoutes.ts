import express, { Router } from "express";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";
import {
    createQuestion,
    getAllQuestions,
    getQuestionById,
    respondToQuestion,
} from "../controllers/questionController";
import { validateRequest } from "../middleware/validate";
import {
    postQuestionSchema,
    getQuestionsByUserSchema,
    getQuestionByIdSchema,
    putQuestionSchema,
} from "../validations/questionValidation";

const router: Router = express.Router();

// Submit a new question to a trainer
router.post(
    "/",
    authenticate,
    isAuthorized({ hasRole: ["premium", "trainer"] }),
    validateRequest(postQuestionSchema),
    createQuestion
);

// Retrieve all questions asked by the authenticated user
router.get(
    "/",
    authenticate,
    isAuthorized({ hasRole: ["trainer"], allowSameUser: true  }),
    validateRequest(getQuestionsByUserSchema),
    getAllQuestions
);

// Retrieve a specific question by ID
router.get(
    "/:id",
    authenticate,
    isAuthorized({ hasRole: ["trainer"], allowSameUser: true }),
    validateRequest(getQuestionByIdSchema),
    getQuestionById
);

// Respond to a question (Trainer)
router.put(
    "/:id",
    authenticate,
    isAuthorized({ hasRole: ["trainer"] }),
    validateRequest(putQuestionSchema),
    respondToQuestion
);

export default router;
