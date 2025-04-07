import { Request, Response, NextFunction } from "express";
import supertest from "supertest";
import request from "supertest";
import app from "../src/app";
import {
    createExercise,
    getAllExercises,
    getExerciseById,
    updateExercise,
    deleteExercise,
} from "../src/api/v1/controllers/exerciseController";
import { Exercise } from "../src/api/v1/models/exerciseModel";

jest.mock("../src/api/v1/middleware/authenticate", () =>
    jest.fn((req: Request, res: Response, next: NextFunction): void | Response => {
        if (!req.headers["authorization"]) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        next();
    })
);

jest.mock("../src/api/v1/middleware/authorize", () =>
    jest.fn(({ hasRole }: { hasRole: string[] }) =>
        (req: Request, res: Response, next: NextFunction): void | Response => {
            const userRole: string | string[] | undefined = req.headers["x-roles"];

            if (Array.isArray(userRole)) {
                if (!userRole.some(role => hasRole.includes(role))) {
                    return res.status(403).json({ error: "Forbidden: Insufficient permissions" });
                }
            } else if (!userRole || !hasRole.includes(userRole)) {
                return res.status(403).json({ error: "Forbidden: Insufficient permissions" });
            }

            next();
        })
);


jest.mock("../src/api/v1/controllers/exerciseController", () => ({
    createExercise: jest.fn((req, res) => res.status(201).json({ message: "Exercise created successfully" })),
    getAllExercises: jest.fn((req, res) => res.status(200).json({ exercises: ["Exercise1", "Exercise2"] })),
    getExerciseById: jest.fn((req, res) => res.status(200).json({ exercise: "Exercise1" })),
    updateExercise: jest.fn((req, res) => res.status(200).json({ message: "Exercise updated successfully" })),
    deleteExercise: jest.fn((req, res) => res.status(204).send()),
}));

describe("Exercise Routes", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("POST /api/v1/exercise", () => {
        it("should allow authorized users to create an exercise", async () => {
            const mockExercise: Exercise = {
                workoutId: "workout123",
                name: "Push-up",
                equipment: ["None"],
                musclesWorked: ["Chest", "Triceps"],
                intensity: "Medium",
                sets: 5,
                reps: 15,
            };

            const response: supertest.Response = await request(app)
                .post("/api/v1/exercise")
                .set("authorization", "Bearer token")
                .set("x-roles", "lite")
                .send(mockExercise);

            expect(response.status).toBe(201);
            expect(response.body.message).toBe("Exercise created successfully");
            expect(createExercise).toHaveBeenCalled();
        });
    });

    describe("GET /api/v1/exercise", () => {
        it("should allow authorized users to retrieve all exercises", async () => {
            const response: supertest.Response = await request(app)
                .get("/api/v1/exercise")
                .set("authorization", "Bearer token")
                .set("x-roles", "lite")
                .query({ workoutId: "workout123" });

            expect(response.status).toBe(200);
            expect(response.body.exercises).toEqual(["Exercise1", "Exercise2"]);
            expect(getAllExercises).toHaveBeenCalled();
        });
    });

    describe("GET /api/v1/exercise/:id", () => {
        it("should allow authorized users to retrieve an exercise by ID", async () => {
            const exerciseId: string = "exercise123";

            const response: supertest.Response = await request(app)
                .get(`/api/v1/exercise/${exerciseId}`)
                .set("authorization", "Bearer token")
                .set("x-roles", "lite");

            expect(response.status).toBe(200);
            expect(response.body.exercise).toBe("Exercise1");
            expect(getExerciseById).toHaveBeenCalled();
        });
    });

    describe("PUT /api/v1/exercise/:id", () => {
        it("should allow authorized users to update an exercise", async () => {
            const exerciseId: string = "exercise123";
            const updatedExercise: Partial<Exercise> = {
                name: "Updated Push-up",
                equipment: ["None"],
                musclesWorked: ["Chest", "Triceps"],
                intensity: "High",
                sets: 5,
                reps: 20,
            };

            const response: supertest.Response = await request(app)
                .put(`/api/v1/exercise/${exerciseId}`)
                .set("authorization", "Bearer token")
                .set("x-roles", "lite")
                .send(updatedExercise);

            expect(response.status).toBe(200);
            expect(response.body.message).toBe("Exercise updated successfully");
            expect(updateExercise).toHaveBeenCalled();
        });
    });

    describe("DELETE /api/v1/exercise/:id", () => {
        it("should allow authorized users to delete an exercise", async () => {
            const exerciseId: string = "exercise123";

            const response: supertest.Response = await request(app)
                .delete(`/api/v1/exercise/${exerciseId}`)
                .set("authorization", "Bearer token")
                .set("x-roles", "lite");

            expect(response.status).toBe(204);
            expect(deleteExercise).toHaveBeenCalled();
        });
    });
});
