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
} from "../src/api/v1/controllers/exerciseLibraryController";

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
            const userRole = req.headers["x-roles"];

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

jest.mock("../src/api/v1/controllers/exerciseLibraryController", () => ({
    createExercise: jest.fn((req: Request, res: Response) => {
        res.status(201).json({ message: "Exercise created successfully" });
    }),
    getAllExercises: jest.fn((req: Request, res: Response) => {
        res.status(200).json({ exercises: ["Exercise1", "Exercise2"] });
    }),
    getExerciseById: jest.fn((req: Request, res: Response) => {
        res.status(200).json({ exercise: "Exercise1" });
    }),
    updateExercise: jest.fn((req: Request, res: Response) => {
        res.status(200).json({ message: "Exercise updated successfully" });
    }),
    deleteExercise: jest.fn((req: Request, res: Response) => {
        res.status(200).json({ message: "Exercise deleted successfully" });
    }),
}));

describe("Exercise Library Routes", () => {
    describe("POST /api/v1/exercise-library", () => {
        it("should allow a trainer to create an exercise", async () => {
            const response: supertest.Response = await request(app)
                .post("/api/v1/exercise-library")
                .set("authorization", "Bearer token")
                .set("x-roles", "trainer")
                .send({
                    name: "Push-up",
                    equipment: ["None"],
                    musclesWorked: ["Chest", "Triceps", "Shoulders"],
                    intensity: "Medium",
                });
        
            expect(response.status).toBe(201);
            expect(response.body.message).toBe("Exercise created successfully");
            expect(createExercise).toHaveBeenCalled();
        });        
    });

    describe("GET /api/v1/exercise-library", () => {
        it("should allow authorized users to get all exercises", async () => {
            const response: supertest.Response = await request(app)
                .get("/api/v1/exercise-library")
                .set("authorization", "Bearer token")
                .set("x-roles", "lite");

            expect(response.status).toBe(200);
            expect(response.body.exercises).toEqual(["Exercise1", "Exercise2"]);
            expect(getAllExercises).toHaveBeenCalled();
        });
    });

    describe("GET /api/v1/exercise-library/:id", () => {
        it("should allow authorized users to get an exercise by ID", async () => {
            const response: supertest.Response = await request(app)
                .get("/api/v1/exercise-library/1")
                .set("authorization", "Bearer token")
                .set("x-roles", "premium");

            expect(response.status).toBe(200);
            expect(response.body.exercise).toBe("Exercise1");
            expect(getExerciseById).toHaveBeenCalled();
        });
    });

    describe("PUT /api/v1/exercise-library/:id", () => {
        it("should allow a trainer to update an exercise", async () => {
            const response: supertest.Response = await request(app)
                .put("/api/v1/exercise-library/1")
                .set("authorization", "Bearer token")
                .set("x-roles", "trainer")
                .send({ name: "Modified Push-up" });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe("Exercise updated successfully");
            expect(updateExercise).toHaveBeenCalled();
        });
    });

    describe("DELETE /api/v1/exercise-library/:id", () => {
        it("should allow a trainer to delete an exercise", async () => {
            const response: supertest.Response = await request(app)
                .delete("/api/v1/exercise-library/1")
                .set("authorization", "Bearer token")
                .set("x-roles", "trainer");

            expect(response.status).toBe(200);
            expect(response.body.message).toBe("Exercise deleted successfully");
            expect(deleteExercise).toHaveBeenCalled();
        });
    });
});
