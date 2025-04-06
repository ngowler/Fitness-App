import request from "supertest";
import app from "../src/app";
import {
    createWorkout,
    getAllWorkouts,
    getWorkoutById,
    updateWorkout,
    deleteWorkout,
} from "../src/api/v1/controllers/workoutController";

jest.mock("../src/api/v1/controllers/workoutController", () => ({
    createWorkout: jest.fn((req, res) => res.status(201).send()),
    getAllWorkouts: jest.fn((req, res) => res.status(200).send()),
    getWorkoutById: jest.fn((req, res) => res.status(200).send()),
    updateWorkout: jest.fn((req, res) => res.status(200).send()),
    deleteWorkout: jest.fn((req, res) => res.status(204).send()),
}));

describe("Workout Routes", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("POST /api/v1/workout", () => {
        it("should call createWorkout controller", async () => {
            const mockWorkout = {
                userId: "user123",
                name: "Strength Training",
                description: "Full-body workout focusing on strength",
                date: "2025-04-06",
                exercises: [
                    {
                        name: "Push-up",
                        equipment: ["None"],
                        musclesWorked: ["Chest", "Triceps"],
                        intensity: "Medium",
                        duration: 30,
                        reps: 12,
                    },
                ],
            };

            await request(app)
                .post("/api/v1/workout")
                .send(mockWorkout);

            expect(createWorkout).toHaveBeenCalled();
            expect(createWorkout).toHaveBeenCalledWith(expect.any(Object), expect.any(Object), expect.any(Function));
        });
    });

    describe("GET /api/v1/workout", () => {
        it("should call getAllWorkouts controller", async () => {
            const queryParams = { userId: "user123" };

            await request(app)
                .get("/api/v1/workout")
                .query(queryParams);

            expect(getAllWorkouts).toHaveBeenCalled();
            expect(getAllWorkouts).toHaveBeenCalledWith(expect.any(Object), expect.any(Object), expect.any(Function));
        });
    });

    describe("GET /api/v1/workout/:workoutId", () => {
        it("should call getWorkoutById controller", async () => {
            const id = "workout123";

            await request(app).get(`/api/v1/workout/${id}`);

            expect(getWorkoutById).toHaveBeenCalled();
            expect(getWorkoutById).toHaveBeenCalledWith(expect.any(Object), expect.any(Object), expect.any(Function));
        });
    });

    describe("PUT /api/v1/workout/:workoutId", () => {
        it("should call updateWorkout controller", async () => {
            const id = "workout123";
            const updatedWorkout = {
                name: "Updated Strength Training",
                description: "Updated full-body strength workout",
                date: "2025-04-07",
                exercises: [
                    {
                        name: "Push-up",
                        equipment: ["None"],
                        musclesWorked: ["Chest", "Triceps"],
                        intensity: "High",
                        duration: 40,
                        reps: 15,
                    },
                ],
            };

            await request(app)
                .put(`/api/v1/workout/${id}`)
                .send(updatedWorkout);

            expect(updateWorkout).toHaveBeenCalled();
            expect(updateWorkout).toHaveBeenCalledWith(expect.any(Object), expect.any(Object), expect.any(Function));
        });
    });

    describe("DELETE /api/v1/workout/:workoutId", () => {
        it("should call deleteWorkout controller", async () => {
            const id = "workout123";

            await request(app).delete(`/api/v1/workout/${id}`);

            expect(deleteWorkout).toHaveBeenCalled();
            expect(deleteWorkout).toHaveBeenCalledWith(expect.any(Object), expect.any(Object), expect.any(Function));
        });
    });
});
