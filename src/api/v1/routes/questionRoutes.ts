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

/**
 * @route POST /question
 * @description Submit a new question to a trainer.
 * 
 * @openapi
 * /question:
 *   post:
 *     summary: Submit a new question
 *     tags: [Question]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Question'
 *     responses:
 *       201:
 *         description: Question submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Question'
 *       400:
 *         description: Invalid input provided
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Server error
 */
router.post(
    "/",
    authenticate,
    isAuthorized({ hasRole: ["premium", "trainer"] }),
    validateRequest(postQuestionSchema),
    createQuestion
);

/**
 * @route GET /question
 * @description Retrieve all questions asked by the authenticated user.
 * 
 * @openapi
 * /question:
 *   get:
 *     summary: Get all questions
 *     tags: [Question]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Questions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Question'
 *       404:
 *         description: No questions found
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Server error
 */
router.get(
    "/",
    authenticate,
    isAuthorized({ hasRole: ["trainer"], allowSameUser: true  }),
    validateRequest(getQuestionsByUserSchema),
    getAllQuestions
);

/**
 * @route GET /question/{id}
 * @description Retrieve a specific question by ID.
 * 
 * @openapi
 * /question/{id}:
 *   get:
 *     summary: Get a specific question
 *     tags: [Question]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the question to retrieve
 *     responses:
 *       200:
 *         description: Question retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Question'
 *       404:
 *         description: Question not found
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Server error
 */
router.get(
    "/:id",
    authenticate,
    isAuthorized({ hasRole: ["trainer"], allowSameUser: true }),
    validateRequest(getQuestionByIdSchema),
    getQuestionById
);

/**
 * @route PUT /question/{id}
 * @description Respond to a question.
 * 
 * @openapi
 * /question/{id}:
 *   put:
 *     summary: Respond to a question
 *     tags: [Question]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the question to respond to
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Question'
 *     responses:
 *       200:
 *         description: Response submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Question'
 *       404:
 *         description: Question not found
 *       400:
 *         description: Invalid response payload
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Server error
 */
router.put(
    "/:id",
    authenticate,
    isAuthorized({ hasRole: ["trainer"] }),
    validateRequest(putQuestionSchema),
    respondToQuestion
);

export default router;
