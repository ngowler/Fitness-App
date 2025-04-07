import { Request, Response, NextFunction } from "express";
import * as questionService from "../services/questionService";
import { Question } from "../models/questionModel";
import { successResponse } from "../models/responseModel";
import { HTTP_STATUS } from "../../../constants/httpConstants";

/**
 * @description Submit a new question to a trainer.
 * @route POST /question/
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function to pass control to the next middleware
 * @returns {Promise<void>}
 */
export const createQuestion = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const currentUserId: string = res.locals.uid;

        if (!currentUserId) {
            throw new Error("User ID is required to submit a question.");
        }

        const newQuestion: Question = await questionService.createQuestion(req.body, currentUserId);

        res.status(HTTP_STATUS.CREATED).json(
            successResponse(newQuestion, "Question Submitted")
        );
    } catch (error) {
        next(error);
    }
};

/**
 * @description Retrieve all questions asked by the authenticated user.
 * @route GET /question/
 * @returns {Promise<void>}
 */
export const getAllQuestions = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId: string = res.locals.uid;
        const userRole: string = res.locals.role;

        if (!userId) {
            res.status(400).json({ message: "User ID is missing" });
            return;
        }

        let questions: Question[];

        if (userRole === "trainer") {
            questions = await questionService.getAllQuestions();
        } else {
            questions = await questionService.getAllQuestionsByUserId(userId);
        }

        if (!questions || questions.length === 0) {
            res.status(404).json({ message: "No questions found" });
            return;
        }

        res.status(200).json({
            success: true,
            data: questions,
            message: "Questions Retrieved",
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @description Retrieve a specific question by ID.
 * @route GET /question/:id
 * @returns {Promise<void>}
 */
export const getQuestionById = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;

        const question: Question = await questionService.getQuestionById(id);

        res.status(HTTP_STATUS.OK).json(
            successResponse(
                question,
                `Question with ID "${id}" retrieved successfully`
            )
        );
    } catch (error) {
        next(error);
    }
};

/**
 * @description Respond to a question.
 * @route PUT /question/:id
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function to pass control to the next middleware
 * @returns {Promise<void>}
 */
export const respondToQuestion = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const currentTrainerId: string = res.locals.uid;

        if (!currentTrainerId) {
            throw new Error("Trainer ID is required to respond to a question.");
        }

        const response: Question = await questionService.respondToQuestion(
            req.params.id,
            req.body,
            currentTrainerId
        );

        res.status(HTTP_STATUS.OK).json(
            successResponse(response, "Question Response Recorded")
        );
    } catch (error) {
        next(error);
    }
};
