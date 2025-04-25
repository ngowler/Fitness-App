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

// Mock authenticate middleware
jest.mock("../src/api/v1/middleware/authenticate", () =>
    jest.fn((req: Request, res: Response, next: NextFunction): void | Response => {
        res.locals.uid = "123"; // Simulate user ID being set by the middleware
        if (!req.headers["authorization"]) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        next();
    })
);

// Helper to extract role from headers
const extractRole = (headers: Record<string, unknown>): string | undefined => {
    const rolesHeader = headers["x-roles"] ?? headers["x-roles".toLowerCase()];
    return Array.isArray(rolesHeader) ? rolesHeader[0] : (rolesHeader as string | undefined);
};

// Mock authorize middleware with allowSameUser logic
jest.mock("../src/api/v1/middleware/authorize", () =>
    jest.fn(({ hasRole, allowSameUser }: { hasRole: string[]; allowSameUser?: boolean }) =>
        (req: Request, res: Response, next: NextFunction): void | Response => {
            const userRole: string = extractRole(req.headers) ?? "trainer";
            const uid: string = res.locals.uid;

            const resourceUserId: string | undefined =
                req.body?.userId ||
                req.query?.userId ||
                req.params?.userId;

            const isSameUser: boolean = Boolean(allowSameUser) && resourceUserId === uid;

            if (hasRole.includes(userRole) || isSameUser) {
                return next();
            }

            return res.status(403).json({ error: "Forbidden: Insufficient permissions" });
        })
);

// Mock controllers
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

    describe("GET /api/v1/exercise", () => {
        it("should allow authorized users to retrieve all exercises", async () => {
            const response: supertest.Response = await request(app)
                .get("/api/v1/exercise")
                .set("authorization", "Bearer token")
                .set("x-roles", "trainer")

            expect(response.status).toBe(200);
            expect(response.body.exercises).toEqual(["Exercise1", "Exercise2"]);
            expect(getAllExercises).toHaveBeenCalled();
        });
    });

    describe("PUT /api/v1/exercise/:id", () => {
        it("should allow authorized users to update an exercise", async () => {
            const exerciseId: string = "exercise123";
            const updatedExercise: Partial<Exercise> = {
                userId: "123",
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
                .set("x-roles", "trainer")

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
                .set("x-roles", "trainer")

            expect(response.status).toBe(204);
            expect(deleteExercise).toHaveBeenCalled();
        });
    });
});
