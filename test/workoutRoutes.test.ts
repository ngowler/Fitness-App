import { Request, Response, NextFunction } from "express";
import request, { Response as SupertestResponse } from "supertest";
import app from "../src/app";
import {
    createWorkout,
    getAllWorkouts,
    getWorkoutById,
    updateWorkout,
    deleteWorkout,
} from "../src/api/v1/controllers/workoutController";

// Mock the auth middleware
jest.mock("../src/api/v1/middleware/authenticate", () =>
    jest.fn((req: Request, res: Response, next: NextFunction): void => {
        if (!req.headers["authorization"]) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        next();
    })
);

// Mock the authorization middleware
jest.mock("../src/api/v1/middleware/authorize", () =>
    jest.fn(({ hasRole, allowSameUser }: { hasRole: string[]; allowSameUser?: boolean }) =>
        (req: Request, res: Response, next: NextFunction): void => {
            const userRoleHeader = req.headers["x-roles"];
            const userId = req.headers["x-user-id"] as string;
            const userRole = Array.isArray(userRoleHeader)
                ? userRoleHeader.join(", ")
                : (userRoleHeader as string);

            if (userRole) {
                if (!hasRole.includes(userRole)) {
                    if (!allowSameUser || userId !== req.params.id) {
                        res.status(403).json({ error: "Forbidden: Insufficient permissions" });
                        return;
                    }
                }
            } else {
                res.status(403).json({ error: "Forbidden: Insufficient permissions" });
                return;
            }

            next();
        })
);

// Mock the controller functions
jest.mock("../src/api/v1/controllers/workoutController", () => ({
    createWorkout: jest.fn((req: Request, res: Response): Response =>
        res.status(201).json({ message: "Workout created successfully" })
    ),
    getAllWorkouts: jest.fn((req: Request, res: Response): Response =>
        res.status(200).json({ workouts: ["Workout1", "Workout2"] })
    ),
    getWorkoutById: jest.fn((req: Request, res: Response): Response =>
        res.status(200).json({ workout: "Workout1" })
    ),
    updateWorkout: jest.fn((req: Request, res: Response): Response =>
        res.status(200).json({ message: "Workout updated successfully" })
    ),
    deleteWorkout: jest.fn((req: Request, res: Response): void => {
        res.status(204).send();
    }),
}));

describe("Workout Routes", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    const authHeaders = {
        authorization: "Bearer token",
        "x-roles": "trainer",
        "x-user-id": "user123",
    };

    describe("POST /api/v1/workout", () => {
        it("should allow authorized users to create a workout", async () => {
            const mockWorkout = {
                name: "Strength Training",
                description: "Full-body workout",
                exerciseLibraryIds: ["exercise1", "exercise2"],
            };

            const response: SupertestResponse = await request(app)
                .post("/api/v1/workout")
                .set(authHeaders)
                .send(mockWorkout);

            expect(response.status).toBe(201);
            expect(response.body.message).toBe("Workout created successfully");
            expect(createWorkout).toHaveBeenCalled();
        });
    });

    describe("GET /api/v1/workout", () => {
        it("should allow trainers to retrieve all workouts", async () => {
            const response: SupertestResponse = await request(app)
                .get("/api/v1/workout")
                .set(authHeaders)
                .query({ userId: "user123" });

            expect(response.status).toBe(200);
            expect(response.body.workouts).toEqual(["Workout1", "Workout2"]);
            expect(getAllWorkouts).toHaveBeenCalled();
        });
    });

    describe("GET /api/v1/workout/:id", () => {
        it("should allow trainers or the same user to retrieve a workout by ID", async () => {
            const id = "workout123";

            const response: SupertestResponse = await request(app)
                .get(`/api/v1/workout/${id}`)
                .set(authHeaders);

            expect(response.status).toBe(200);
            expect(response.body.workout).toBe("Workout1");
            expect(getWorkoutById).toHaveBeenCalled();
        });
    });

    describe("PUT /api/v1/workout/:id", () => {
        it("should allow trainers or the same user to update a workout", async () => {
            const id = "workout123";
            const updatedWorkout = {
                name: "Updated Strength Training",
                description: "Updated workout description",
            };
    
            const response: SupertestResponse = await request(app)
                .put(`/api/v1/workout/${id}`)
                .set(authHeaders)
                .send(updatedWorkout);
    
            expect(response.status).toBe(200);
            expect(response.body.message).toBe("Workout updated successfully");
            expect(updateWorkout).toHaveBeenCalled();
        });
    });

    describe("DELETE /api/v1/workout/:id", () => {
        it("should allow trainers or the same user to delete a workout", async () => {
            const id = "workout123";

            const response: SupertestResponse = await request(app)
                .delete(`/api/v1/workout/${id}`)
                .set(authHeaders);

            expect(response.status).toBe(204);
            expect(deleteWorkout).toHaveBeenCalled();
        });
    });
});
