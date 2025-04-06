import request from "supertest";
import app from "../src/app";
import {
    createQuestion,
    getAllQuestions,
    getQuestionById,
    respondToQuestion,
} from "../src/api/v1/controllers/questionController";

jest.mock("../src/api/v1/controllers/questionController", () => ({
    createQuestion: jest.fn((req, res) => res.status(201).send()),
    getAllQuestions: jest.fn((req, res) => res.status(200).send()),
    getQuestionById: jest.fn((req, res) => res.status(200).send()),
    respondToQuestion: jest.fn((req, res) => res.status(200).send()),
}));

describe("Question Routes", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("POST /api/v1/question", () => {
        it("should call createQuestion controller", async () => {
            const mockQuestion = {
                userId: "user123",
                question: "How do I improve my bench press form?",
            };

            await request(app)
                .post("/api/v1/question")
                .send(mockQuestion);

            expect(createQuestion).toHaveBeenCalled();
            expect(createQuestion).toHaveBeenCalledWith(expect.any(Object), expect.any(Object), expect.any(Function));
        });
    });

    describe("GET /api/v1/question", () => {
        it("should call getAllQuestions controller", async () => {
            const queryParams = { userId: "user123" };

            await request(app)
                .get("/api/v1/question")
                .query(queryParams);

            expect(getAllQuestions).toHaveBeenCalled();
            expect(getAllQuestions).toHaveBeenCalledWith(expect.any(Object), expect.any(Object), expect.any(Function));
        });
    });

    describe("GET /api/v1/question/:id", () => {
        it("should call getQuestionById controller", async () => {
            const questionId = "question123";

            await request(app).get(`/api/v1/question/${questionId}`);

            expect(getQuestionById).toHaveBeenCalled();
            expect(getQuestionById).toHaveBeenCalledWith(expect.any(Object), expect.any(Object), expect.any(Function));
        });
    });

    describe("PUT /api/v1/question/:id", () => {
        it("should call respondToQuestion controller", async () => {
            const questionId = "question123";
            const responsePayload = {
                id: questionId,
                trainerId: "trainer123",
                response: "Focus on engaging your chest muscles and avoid bouncing the bar.",
            };

            await request(app)
                .put(`/api/v1/question/${questionId}`)
                .send(responsePayload);

            expect(respondToQuestion).toHaveBeenCalled();
            expect(respondToQuestion).toHaveBeenCalledWith(expect.any(Object), expect.any(Object), expect.any(Function));
        });
    });
});
