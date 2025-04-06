import request from "supertest";
import app from "../src/app";
import {
    createExercise,
    getAllExercises,
    getExerciseById,
    updateExercise,
    deleteExercise
} from "../src/api/v1/controllers/exerciseLibraryController";

jest.mock("../src/api/v1/controllers/exerciseLibraryController", () => ({
    createExercise: jest.fn((req, res) => res.status(201).send()),
    getAllExercises: jest.fn((req, res) => res.status(200).send()),
    getExerciseById: jest.fn((req, res) => res.status(200).send()),
    updateExercise: jest.fn((req, res) => res.status(200).send()),
    deleteExercise: jest.fn((req, res) => res.status(200).send()),
}));

jest.mock("../src/api/v1/services/questionService", () => ({
    createQuestion: jest.fn(() => Promise.resolve({})),
    respondToQuestion: jest.fn(() => Promise.resolve({})),
}));


describe("Exercise Library Routes", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("POST /api/v1/exercise-library", () => {
        it("should call createExercise controller", async () => {
            const mockExercise = {
                name: "Push-up",
                equipment: ["None"],
                musclesWorked: ["Chest", "Triceps", "Shoulders"],
                intensity: "Medium"
            };            
            await request(app).post("/api/v1/exercise-library").send(mockExercise);
            expect(createExercise).toHaveBeenCalled();
        });
    });

    describe("GET /api/v1/exercise-library", () => {
        it("should call getAllExercises controller", async () => {
            await request(app).get("/api/v1/exercise-library");
            expect(getAllExercises).toHaveBeenCalled();
        });
    });

    describe("GET /api/v1/exercise-library/:id", () => {
        it("should call getExerciseById controller", async () => {
            await request(app).get("/api/v1/exercise-library/1");
            expect(getExerciseById).toHaveBeenCalled();
        });
    });

    describe("PUT /api/v1/exercise-library/:id", () => {
        it("should call updateExercise controller", async () => {
            const updatedExercise = {
                name: "Push-up",
                equipment: ["None"],
                musclesWorked: ["Chest", "Triceps", "Shoulders"],
                intensity: "Medium"
            };            
            await request(app).put("/api/v1/exercise-library/1").send(updatedExercise);
            expect(updateExercise).toHaveBeenCalled();
        });
    });

    describe("DELETE /api/v1/exercise-library/:id", () => {
        it("should call deleteExercise controller", async () => {
            await request(app).delete("/api/v1/exercise-library/1");
            expect(deleteExercise).toHaveBeenCalled();
        });
    });
});
