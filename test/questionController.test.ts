import { Request, Response, NextFunction } from "express";
import * as questionController from "../src/api/v1/controllers/questionController";
import * as questionService from "../src/api/v1/services/questionService";
import { Question } from "../src/api/v1/models/questionModel";
import { HTTP_STATUS } from "../src/constants/httpConstants";

jest.mock("../src/api/v1/services/questionService");

describe("Question Controller", () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let mockNext: NextFunction;

    beforeEach(() => {
        jest.clearAllMocks();
        mockReq = { body: {}, params: {}, query: {} };
        mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        mockNext = jest.fn();
    });

    describe("createQuestion", () => {
        it("should handle successful question submission", async () => {
            const mockNewQuestion: Question = {
                id: "1",
                userId: "123",
                question: "What is the best way to improve stamina?",
                trainerId: undefined,
                response: undefined,
                dateAsked: "2025-04-05",
                dateResponded: undefined,
            };

            (questionService.createQuestion as jest.Mock).mockResolvedValue(mockNewQuestion);
            mockReq.body = { question: "What is the best way to improve stamina?" };
            mockRes.locals = { uid: "123" };

            await questionController.createQuestion(mockReq as Request, mockRes as Response, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.CREATED);
            expect(mockRes.json).toHaveBeenCalledWith({
                status: "success",
                message: "Question Submitted",
                data: mockNewQuestion,
            });
        });
    });

    describe("getAllQuestions", () => {
        it("should retrieve all questions for a trainer", async () => {
            const mockQuestions: Question[] = [
                {
                    id: "1",
                    userId: "123",
                    question: "What is the best way to improve stamina?",
                    trainerId: "456",
                    response: "Start with interval training.",
                    dateAsked: "2025-04-05",
                    dateResponded: "2025-04-06",
                },
            ];

            (questionService.getAllQuestions as jest.Mock).mockResolvedValue(mockQuestions);
            mockRes.locals = { uid: "456", role: "trainer" };

            await questionController.getAllQuestions(mockReq as Request, mockRes as Response, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: true,
                data: mockQuestions,
                message: "Questions Retrieved",
            });
        });

        it("should retrieve all questions for a user", async () => {
            const mockQuestions: Question[] = [
                {
                    id: "1",
                    userId: "123",
                    question: "What is the best way to improve stamina?",
                    trainerId: undefined,
                    response: undefined,
                    dateAsked: "2025-04-05",
                    dateResponded: undefined,
                },
            ];

            (questionService.getAllQuestionsByUserId as jest.Mock).mockResolvedValue(mockQuestions);
            mockRes.locals = { uid: "123", role: "user" };

            await questionController.getAllQuestions(mockReq as Request, mockRes as Response, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: true,
                data: mockQuestions,
                message: "Questions Retrieved",
            });
        });
    });

    describe("getQuestionById", () => {
        it("should handle successful retrieval by ID", async () => {
            const mockQuestion: Question = {
                id: "1",
                userId: "123",
                question: "What is the best way to improve stamina?",
                trainerId: "456",
                response: "Start with interval training.",
                dateAsked: "2025-04-05",
                dateResponded: "2025-04-06",
            };

            (questionService.getQuestionById as jest.Mock).mockResolvedValue(mockQuestion);
            mockReq.params = { id: "1" };

            await questionController.getQuestionById(mockReq as Request, mockRes as Response, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith({
                status: "success",
                message: `Question with ID "1" retrieved successfully`,
                data: mockQuestion,
            });
        });
    });

    describe("respondToQuestion", () => {
        it("should handle successful response to a question", async () => {
            const mockResponse: Question = {
                id: "1",
                userId: "123",
                question: "What is the best way to improve stamina?",
                trainerId: "456",
                response: "Start with interval training.",
                dateAsked: "2025-04-05",
                dateResponded: "2025-04-06",
            };

            (questionService.respondToQuestion as jest.Mock).mockResolvedValue(mockResponse);
            mockReq.params = { id: "1" };
            mockReq.body = { response: "Start with interval training." };
            mockRes.locals = { uid: "456" };

            await questionController.respondToQuestion(mockReq as Request, mockRes as Response, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith({
                status: "success",
                message: "Question Response Recorded",
                data: mockResponse,
            });
        });
    });
});
