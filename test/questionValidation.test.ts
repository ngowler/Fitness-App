import { Request, Response, NextFunction } from "express";
import { validate, validateRequest } from "../src/api/v1/middleware/validate";
import {
    postQuestionSchema,
    getQuestionsByUserSchema,
    getQuestionByIdSchema,
    putQuestionSchema,
} from "../src/api/v1/validations/questionValidation";

describe("validate function for questions", () => {
    interface Data {
        [key: string]: string;
    }

    describe("postQuestionSchema", () => {
        it("should not throw an error for valid question data", () => {
            const data: Data = {
                userId: "1",
                question: "What is the best workout for building strength?",
            };
            expect(() => validate(postQuestionSchema, data)).not.toThrow();
        });

        it("should throw an error for missing userId", () => {
            const data: Data = {
                question: "What is the best workout for building strength?",
            };
            expect(() => validate(postQuestionSchema, data)).toThrow("User ID is required");
        });

        it("should throw an error for empty question", () => {
            const data: Data = {
                userId: "1",
                question: "",
            };
            expect(() => validate(postQuestionSchema, data)).toThrow("Question cannot be empty");
        });
    });

    describe("getQuestionsByUserSchema", () => {
        it("should not throw an error for valid userId", () => {
            const data: Data = { userId: "1" };
            expect(() => validate(getQuestionsByUserSchema, data)).not.toThrow();
        });

        it("should throw an error for missing userId", () => {
            const data: Data = {};
            expect(() => validate(getQuestionsByUserSchema, data)).toThrow("User ID is required");
        });
    });

    describe("getQuestionByIdSchema", () => {
        it("should not throw an error for valid ID", () => {
            const data: Data = { id: "1" };
            expect(() => validate(getQuestionByIdSchema, data)).not.toThrow();
        });

        it("should throw an error for missing ID", () => {
            const data: Data = {};
            expect(() => validate(getQuestionByIdSchema, data)).toThrow("Question ID is required");
        });
    });

    describe("putQuestionSchema", () => {
        it("should not throw an error for valid update data", () => {
            const data: Data = {
                id: "1",
                trainerId: "123",
                response: "Focus on compound movements like squats, deadlifts, and bench presses.",
            };
            expect(() => validate(putQuestionSchema, data)).not.toThrow();
        });

        it("should throw an error for missing ID", () => {
            const data: Data = {
                trainerId: "123",
                response: "Focus on compound movements like squats, deadlifts, and bench presses.",
            };
            expect(() => validate(putQuestionSchema, data)).toThrow("Question ID is required");
        });

        it("should throw an error for empty response", () => {
            const data: Data = {
                id: "1",
                trainerId: "123",
                response: "",
            };
            expect(() => validate(putQuestionSchema, data)).toThrow("Response cannot be empty");
        });
    });
});

describe("validateRequest middleware for questions", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        req = { body: {}, params: {}, query: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
    });

    it("should not throw an error for valid postQuestionSchema data", () => {
        req.body = {
            userId: "1",
            question: "What is the best workout for building strength?",
        };

        validateRequest(postQuestionSchema)(req as Request, res as Response, next);

        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });

    it("should return 400 for missing userId", () => {
        req.body = {
            question: "What is the best workout for building strength?",
        };

        validateRequest(postQuestionSchema)(req as Request, res as Response, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: "Validation error: User ID is required",
        });
    });

    it("should not throw an error for valid getQuestionByIdSchema data", () => {
        req.params = { id: "1" };

        validateRequest(getQuestionByIdSchema)(req as Request, res as Response, next);

        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });

    it("should return 400 for missing id", () => {
        req.params = {};

        validateRequest(getQuestionByIdSchema)(req as Request, res as Response, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: "Validation error: Question ID is required",
        });
    });

    it("should not throw an error for valid putQuestionSchema data", () => {
        req.body = {
            id: "1",
            trainerId: "123",
            response: "Focus on compound movements like squats, deadlifts, and bench presses.",
        };

        validateRequest(putQuestionSchema)(req as Request, res as Response, next);

        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });

    it("should return 400 for missing response", () => {
        req.body = {
            id: "1",
            trainerId: "123",
            response: "",
        };

        validateRequest(putQuestionSchema)(req as Request, res as Response, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: "Validation error: Response cannot be empty",
        });
    });
});
