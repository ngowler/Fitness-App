import { Request, Response, NextFunction } from "express";
import request from "supertest";
import app from "../src/app";
import {
    createQuestion,
    getAllQuestions,
    getQuestionById,
    respondToQuestion,
} from "../src/api/v1/controllers/questionController";

jest.mock("../src/api/v1/middleware/authenticate", () =>
    jest.fn((req, res, next) => {
        if (!req.headers["authorization"]) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        next();
    })
);

jest.mock("../src/api/v1/middleware/authorize", () =>
    jest.fn(({ hasRole, allowSameUser }: { hasRole: string[]; allowSameUser?: boolean }) =>
        (req: Request, res: Response, next: NextFunction) => {
            const userRole = req.headers["x-roles"];
            const userId = req.headers["x-user-id"];

            if (Array.isArray(userRole)) {
                if (!userRole.some(role => hasRole.includes(role))) {
                    return res.status(403).json({ error: "Forbidden: Insufficient permissions" });
                }
            } else if (!userRole || !hasRole.includes(userRole)) {
                if (!allowSameUser || userId !== req.params.id) {
                    return res.status(403).json({ error: "Forbidden: Insufficient permissions" });
                }
            }
            next();
        })
);


jest.mock("../src/api/v1/controllers/questionController", () => ({
    createQuestion: jest.fn((req, res) => res.status(201).json({ message: "Question created successfully" })),
    getAllQuestions: jest.fn((req, res) => res.status(200).json({ questions: ["Question1", "Question2"] })),
    getQuestionById: jest.fn((req, res) => res.status(200).json({ question: "Question1" })),
    respondToQuestion: jest.fn((req, res) => res.status(200).json({ message: "Response saved successfully" })),
}));

describe("Question Routes", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("POST /api/v1/question", () => {
        it("should allow authorized users to create a question", async () => {
            const mockQuestion = {
                userId: "user123",
                question: "How do I improve my bench press form?",
            };

            const response = await request(app)
                .post("/api/v1/question")
                .set("authorization", "Bearer token")
                .set("x-roles", "premium")
                .send(mockQuestion);

            expect(response.status).toBe(201);
            expect(response.body.message).toBe("Question created successfully");
            expect(createQuestion).toHaveBeenCalled();
        });
    });

    describe("GET /api/v1/question", () => {
        it("should allow trainers to retrieve all questions", async () => {
            const response = await request(app)
                .get("/api/v1/question")
                .set("authorization", "Bearer token")
                .set("x-roles", "trainer")
                .query({ userId: "user123" });
            
            expect(response.status).toBe(200);
            expect(response.body.questions).toEqual(["Question1", "Question2"]);
            expect(getAllQuestions).toHaveBeenCalled();
        });
    });

    describe("GET /api/v1/question/:id", () => {
        it("should allow trainers or the same user to retrieve a question by ID", async () => {
            const questionId = "question123";

            const response = await request(app)
                .get(`/api/v1/question/${questionId}`)
                .set("authorization", "Bearer token")
                .set("x-roles", "trainer");

            expect(response.status).toBe(200);
            expect(response.body.question).toBe("Question1");
            expect(getQuestionById).toHaveBeenCalled();
        });
    });

    describe("PUT /api/v1/question/:id", () => {
        it("should allow trainers to respond to a question", async () => {
            const questionId = "question123";
            const responsePayload = {
                id: questionId,
                trainerId: "trainer123",
                response: "Focus on engaging your chest muscles and avoid bouncing the bar.",
            };

            const response = await request(app)
                .put(`/api/v1/question/${questionId}`)
                .set("authorization", "Bearer token")
                .set("x-roles", "trainer")
                .send(responsePayload);

            expect(response.status).toBe(200);
            expect(response.body.message).toBe("Response saved successfully");
            expect(respondToQuestion).toHaveBeenCalled();
        });
    });
});
