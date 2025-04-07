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

jest.mock("../src/api/v1/middleware/authenticate", () =>
    jest.fn((req: Request, res: Response, next: NextFunction): void => {
        if (!req.headers["authorization"]) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        next();
    })
);

jest.mock("../src/api/v1/middleware/authorize", () =>
    jest.fn(({ hasRole, allowSameUser }: { hasRole: string[]; allowSameUser?: boolean }) =>
        (req: Request, res: Response, next: NextFunction): void => {
            const userRoleHeader = req.headers["x-roles"];
            const userId = req.headers["x-user-id"] as string | undefined;

            const userRole: string | undefined = Array.isArray(userRoleHeader)
                ? userRoleHeader.join(", ")
                : (userRoleHeader as string | undefined);

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
    afterEach((): void => {
        jest.clearAllMocks();
    });

    describe("POST /api/v1/workout", () => {
        it("should allow authorized users to create a workout", async (): Promise<void> => {
            const mockWorkout: {
                name: string;
                description: string;
                date: string;
                exercises: {
                    name: string;
                    equipment: string[];
                    musclesWorked: string[];
                    intensity: string;
                    sets: number;
                    reps: number;
                }[];
            } = {
                name: "Strength Training",
                description: "Full-body workout focusing on strength",
                date: "2025-04-06",
                exercises: [
                    {
                        name: "Push-up",
                        equipment: ["None"],
                        musclesWorked: ["Chest", "Triceps"],
                        intensity: "Medium",
                        sets: 5,
                        reps: 12,
                    },
                ],
            };

            const response: SupertestResponse = await request(app)
                .post("/api/v1/workout")
                .set("authorization", "Bearer token")
                .set("x-roles", "lite")
                .send(mockWorkout);

            expect(response.status).toBe(201);
            expect(response.body.message).toBe("Workout created successfully");
            expect(createWorkout).toHaveBeenCalled();
        });
    });

    describe("GET /api/v1/workout", () => {
        it("should allow trainers to retrieve all workouts", async (): Promise<void> => {
            const response: SupertestResponse = await request(app)
                .get("/api/v1/workout")
                .set("authorization", "Bearer token")
                .set("x-roles", "trainer")
                .query({ userId: "user123" });

            expect(response.status).toBe(200);
            expect(response.body.workouts).toEqual(["Workout1", "Workout2"]);
            expect(getAllWorkouts).toHaveBeenCalled();
        });
    });

    describe("GET /api/v1/workout/:id", () => {
        it("should allow trainers or the same user to retrieve a workout by ID", async (): Promise<void> => {
            const id: string = "workout123";

            const response: SupertestResponse = await request(app)
                .get(`/api/v1/workout/${id}`)
                .set("authorization", "Bearer token")
                .set("x-roles", "trainer");

            expect(response.status).toBe(200);
            expect(response.body.workout).toBe("Workout1");
            expect(getWorkoutById).toHaveBeenCalled();
        });
    });

    describe("PUT /api/v1/workout/:id", () => {
        it("should allow trainers or the same user to update a workout", async (): Promise<void> => {
            const id: string = "workout123";
            const updatedWorkout: {
                name: string;
                description: string;
                date: string;
                exercises: {
                    name: string;
                    equipment: string[];
                    musclesWorked: string[];
                    intensity: string;
                    sets: number;
                    reps: number;
                }[];
            } = {
                name: "Updated Strength Training",
                description: "Updated full-body strength workout",
                date: "2025-04-07",
                exercises: [
                    {
                        name: "Push-up",
                        equipment: ["None"],
                        musclesWorked: ["Chest", "Triceps"],
                        intensity: "High",
                        sets: 5,
                        reps: 15,
                    },
                ],
            };

            const response: SupertestResponse = await request(app)
                .put(`/api/v1/workout/${id}`)
                .set("authorization", "Bearer token")
                .set("x-roles", "trainer")
                .send(updatedWorkout);

            expect(response.status).toBe(200);
            expect(response.body.message).toBe("Workout updated successfully");
            expect(updateWorkout).toHaveBeenCalled();
        });
    });

    describe("DELETE /api/v1/workout/:id", () => {
        it("should allow trainers or the same user to delete a workout", async (): Promise<void> => {
            const id: string = "workout123";

            const response: SupertestResponse = await request(app)
                .delete(`/api/v1/workout/${id}`)
                .set("authorization", "Bearer token")
                .set("x-roles", "trainer");

            expect(response.status).toBe(204);
            expect(deleteWorkout).toHaveBeenCalled();
        });
    });
});
