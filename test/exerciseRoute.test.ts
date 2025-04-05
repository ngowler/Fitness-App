import request from "supertest";
import app from "../src/app";
import {
    createExercise,
    getAllExercises,
    getExerciseById,
    updateExercise,
    deleteExercise,
} from "../src/api/v1/controllers/exerciseController";

jest.mock("../src/api/v1/controllers/exerciseController", () => ({
    createExercise: jest.fn((req, res) => res.status(201).send()),
    getAllExercises: jest.fn((req, res) => res.status(200).send()),
    getExerciseById: jest.fn((req, res) => res.status(200).send()),
    updateExercise: jest.fn((req, res) => res.status(200).send()),
    deleteExercise: jest.fn((req, res) => res.status(204).send()),
}));

describe("Exercise Routes", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("POST /api/v1/exercise", () => {
        it("should call createExercise controller", async () => {
            const mockExercise = {
                workoutId: "workout123",
                name: "Push-up",
                equipment: ["None"],
                musclesWorked: ["Chest", "Triceps"],
                intensity: "Medium",
                duration: 30,
                reps: 15,
            };

            await request(app)
                .post("/api/v1/exercise")
                .send(mockExercise);

            expect(createExercise).toHaveBeenCalled();
            expect(createExercise).toHaveBeenCalledWith(expect.any(Object), expect.any(Object), expect.any(Function));
        });
    });

    describe("GET /api/v1/exercise", () => {
        it("should call getAllExercises controller", async () => {
            const queryParams = { workoutId: "workout123" };

            await request(app)
                .get("/api/v1/exercise")
                .query(queryParams);

            expect(getAllExercises).toHaveBeenCalled();
            expect(getAllExercises).toHaveBeenCalledWith(expect.any(Object), expect.any(Object), expect.any(Function));
        });
    });

    describe("GET /api/v1/exercise/:id", () => {
        it("should call getExerciseById controller", async () => {
            const exerciseId = "exercise123";

            await request(app).get(`/api/v1/exercise/${exerciseId}`);

            expect(getExerciseById).toHaveBeenCalled();
            expect(getExerciseById).toHaveBeenCalledWith(expect.any(Object), expect.any(Object), expect.any(Function));
        });
    });

    describe("PUT /api/v1/exercise/:id", () => {
        it("should call updateExercise controller", async () => {
            const exerciseId = "exercise123";
            const updatedExercise = {
                name: "Updated Push-up",
                equipment: ["None"],
                musclesWorked: ["Chest", "Triceps"],
                intensity: "High",
                duration: 45,
                reps: 20,
            };

            await request(app)
                .put(`/api/v1/exercise/${exerciseId}`)
                .send(updatedExercise);

            expect(updateExercise).toHaveBeenCalled();
            expect(updateExercise).toHaveBeenCalledWith(expect.any(Object), expect.any(Object), expect.any(Function));
        });
    });

    describe("DELETE /api/v1/exercise/:id", () => {
        it("should call deleteExercise controller", async () => {
            const exerciseId = "exercise123";

            await request(app).delete(`/api/v1/exercise/${exerciseId}`);

            expect(deleteExercise).toHaveBeenCalled();
            expect(deleteExercise).toHaveBeenCalledWith(expect.any(Object), expect.any(Object), expect.any(Function));
        });
    });
});
