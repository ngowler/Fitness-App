import { Request, Response, NextFunction } from "express";
import request, { Response as SupertestResponse } from "supertest";
import app from "../src/app";
import {
    createUser,
    getUserById,
    updateUser,
    deleteUser,
} from "../src/api/v1/controllers/userController";

jest.mock("../src/api/v1/middleware/authenticate", () =>
    jest.fn((req: Request, res: Response, next: NextFunction): Response | void => {
        if (!req.headers["authorization"]) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        next();
    })
);

jest.mock("../src/api/v1/middleware/authorize", () =>
    jest.fn(({ hasRole, allowSameUser }: { hasRole: string[]; allowSameUser?: boolean }) =>
        (req: Request, res: Response, next: NextFunction): Response | void => {
            const userRoleHeader: string | string[] | undefined = req.headers["x-roles"];
            const userId: string | undefined = req.headers["x-user-id"] as string | undefined;

            const userRole: string | undefined = Array.isArray(userRoleHeader)
                ? userRoleHeader.join(", ")
                : (userRoleHeader as string | undefined);

            if (userRole) {
                if (!hasRole.includes(userRole.toLowerCase())) {
                    if (!allowSameUser || userId !== req.params.uid) {
                        return res.status(403).json({ error: "Forbidden: Insufficient permissions" });
                    }
                }
            } else {
                return res.status(403).json({ error: "Forbidden: Insufficient permissions" });
            }
            next();
        })
);

jest.mock("../src/api/v1/controllers/userController", () => ({
    createUser: jest.fn((req: Request, res: Response): Response =>
        res.status(201).json({
            uid: "user123",
            name: req.body.name,
            email: req.body.email,
            role: req.body.role,
        })
    ),
    getUserById: jest.fn((req: Request, res: Response): Response =>
        res.status(200).json({
            user: {
                uid: req.params.uid,
                name: "John Doe",
                email: "johndoe@example.com",
                role: "premium",
            },
        })
    ),
    updateUser: jest.fn((req: Request, res: Response): Response =>
        res.status(200).json({ message: "User updated successfully" })
    ),
    deleteUser: jest.fn((req: Request, res: Response): void => {
        res.status(204).send();
        return;
    }),
}));

describe("User Routes", () => {
    afterEach((): void => {
        jest.clearAllMocks();
    });

    describe("POST /api/v1/user", () => {
        it("should allow admins to create a user", async (): Promise<void> => {
            const mockUser = {
                name: "John Doe",
                email: "johndoe@example.com",
                password: "Secure123!",
                role: "Premium",
                healthMetrics: {
                    weight: 70,
                    height: 175,
                    bodyFatPercentage: 15,
                    injuriesOrLimitations: [],
                },
                workoutPreferences: {
                    daysAvailable: ["Monday", "Wednesday", "Friday"],
                    timePerDay: 60,
                    gymAccess: true,
                    equipment: ["dumbbells"],
                },
                background: {
                    experience: "Beginner",
                    routine: "Strength training",
                    goals: "Lose weight",
                },
            };

            const response: SupertestResponse = await request(app)
                .post("/api/v1/user")
                .set("authorization", "Bearer token")
                .set("x-roles", "admin")
                .send(mockUser);

            expect(response.status).toBe(201);
            expect(response.body.name).toBe(mockUser.name);
            expect(response.body.email).toBe(mockUser.email);
            expect(createUser).toHaveBeenCalled();
        });
    });

    describe("GET /api/v1/user/:id", () => {
        it("should allow admins or the same user to retrieve user details", async (): Promise<void> => {
            const uid: string = "user123";

            const response: SupertestResponse = await request(app)
                .get(`/api/v1/user/${uid}`)
                .set("authorization", "Bearer token")
                .set("x-roles", "admin");

            expect(response.status).toBe(200);
            expect(response.body.user.name).toBe("John Doe");
            expect(getUserById).toHaveBeenCalled();
        });
    });

    describe("PUT /api/v1/user/:id", () => {
        it("should allow admins or the same user to update user information", async (): Promise<void> => {
            const uid: string = "user123";
            const updatedUser = {
                name: "John Smith",
                email: "johnsmith@example.com",
                role: "Trainer",
            };

            const response: SupertestResponse = await request(app)
                .put(`/api/v1/user/${uid}`)
                .set("authorization", "Bearer token")
                .set("x-roles", "admin")
                .send(updatedUser);

            expect(response.status).toBe(200);
            expect(response.body.message).toBe("User updated successfully");
            expect(updateUser).toHaveBeenCalled();
        });
    });

    describe("DELETE /api/v1/user/:id", () => {
        it("should allow admins or the same user to delete a user", async (): Promise<void> => {
            const userId: string = "user123";

            const response: SupertestResponse = await request(app)
                .delete(`/api/v1/user/${userId}`)
                .set("authorization", "Bearer token")
                .set("x-roles", "admin");

            expect(response.status).toBe(204);
            expect(deleteUser).toHaveBeenCalled();
        });
    });
});
