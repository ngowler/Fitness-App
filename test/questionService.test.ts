import {
    createQuestion,
    getAllQuestions,
    getAllQuestionsByUserId,
    getQuestionById,
    respondToQuestion,
} from "../src/api/v1/services/questionService";
import {
    getDocuments,
    createDocument,
    updateDocument,
    getDocumentById,
} from "../src/api/v1/repositories/firestoreRepository";
import { Question } from "../src/api/v1/models/questionModel";
import { ServiceError } from "../src/api/v1/errors/errors";

jest.mock("../src/api/v1/repositories/firestoreRepository", () => ({
    getDocuments: jest.fn(),
    createDocument: jest.fn(),
    updateDocument: jest.fn(),
    getDocumentById: jest.fn(),
}));

describe("Question Service", () => {
    describe("createQuestion", () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });

        it("should create a new question", async () => {
            const mockQuestionData: Partial<Question> = { question: "What is the schedule?" };
            const mockUserId = "user123";

            (createDocument as jest.Mock).mockResolvedValue("question123");

            const result = await createQuestion(mockQuestionData, mockUserId);

            expect(createDocument).toHaveBeenCalledWith("questions", {
                ...mockQuestionData,
                userId: mockUserId,
                dateAsked: expect.any(String),
            });
            expect(result).toEqual({
                id: "question123",
                ...mockQuestionData,
                userId: mockUserId,
                dateAsked: expect.any(String),
            });
        });

        it("should throw an error if user ID is missing", async () => {
            const mockQuestionData: Partial<Question> = { question: "What is the schedule?" };

            await expect(createQuestion(mockQuestionData, "")).rejects.toThrow(
                new ServiceError("Failed to create question: User ID is required to submit a question.", "VALIDATION_ERROR")
            );

            expect(createDocument).not.toHaveBeenCalled();
        });
    });

    describe("getAllQuestions", () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });

        it("should return all questions", async () => {
            const mockDocs = [
                {
                    id: "question123",
                    data: () => ({ userId: "user123", question: "What is the schedule?" }),
                },
                {
                    id: "question456",
                    data: () => ({ userId: "user456", question: "Can I reschedule my session?" }),
                },
            ];

            (getDocuments as jest.Mock).mockResolvedValue({ docs: mockDocs });

            const result = await getAllQuestions();

            expect(getDocuments).toHaveBeenCalledWith("questions");
            expect(result).toHaveLength(2);
            expect(result[0]).toEqual({ id: "question123", userId: "user123", question: "What is the schedule?" });
            expect(result[1]).toEqual({
                id: "question456",
                userId: "user456",
                question: "Can I reschedule my session?",
            });
        });
    });

    describe("getAllQuestionsByUserId", () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });

        it("should return questions filtered by user ID", async () => {
            const mockDocs = [
                {
                    id: "question123",
                    data: () => ({ userId: "user123", question: "What is the schedule?" }),
                },
                {
                    id: "question456",
                    data: () => ({ userId: "user456", question: "Can I reschedule my session?" }),
                },
            ];

            (getDocuments as jest.Mock).mockResolvedValue({ docs: mockDocs });

            const result = await getAllQuestionsByUserId("user123");

            expect(result).toHaveLength(1);
            expect(result[0]).toEqual({ id: "question123", userId: "user123", question: "What is the schedule?" });
        });
    });

    describe("getQuestionById", () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });

        it("should retrieve a question by its ID", async () => {
            const mockDoc = {
                id: "question123",
                exists: true,
                data: () => ({ userId: "user123", question: "What is the schedule?" }),
            };

            (getDocumentById as jest.Mock).mockResolvedValue(mockDoc);

            const result = await getQuestionById("question123");

            expect(getDocumentById).toHaveBeenCalledWith("questions", "question123");
            expect(result).toEqual({ id: "question123", userId: "user123", question: "What is the schedule?" });
        });

        it("should handle non-existent question", async () => {
            const mockDoc = { id: "question123", exists: false };

            (getDocumentById as jest.Mock).mockResolvedValue(mockDoc);

            await expect(getQuestionById("question123")).rejects.toThrow(
                new ServiceError("Failed to retrieve question question123: Question with ID question123 not found.", "ERROR_CODE")
            );

            expect(getDocumentById).toHaveBeenCalledWith("questions", "question123");
        });
    });

    describe("respondToQuestion", () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });

        it("should respond to an existing question", async () => {
            const id = "question123";
            const mockResponseData: Partial<Question> = { response: "The schedule is as follows..." };
            const mockTrainerId = "trainer123";

            (updateDocument as jest.Mock).mockResolvedValue(undefined);

            const result = await respondToQuestion(id, mockResponseData, mockTrainerId);

            expect(updateDocument).toHaveBeenCalledWith("questions", id, {
                ...mockResponseData,
                trainerId: mockTrainerId,
                dateResponded: expect.any(String),
            });
            expect(result).toEqual({
                id,
                ...mockResponseData,
                trainerId: mockTrainerId,
                dateResponded: expect.any(String),
            });
        });

        it("should throw an error if trainer ID is missing", async () => {
            const id = "question123";
            const mockResponseData: Partial<Question> = { response: "The schedule is as follows..." };

            await expect(respondToQuestion(id, mockResponseData, "")).rejects.toThrow(
                new ServiceError("Failed to respond to question question123: Trainer ID is required to respond to a question.", "VALIDATION_ERROR")
            );

            expect(updateDocument).not.toHaveBeenCalled();
        });
    });
});
