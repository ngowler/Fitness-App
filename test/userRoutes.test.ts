import { Request, Response, NextFunction } from "express";
import request from "supertest";
import app from "../src/app";
import {
    createUser,
    getUserById,
    updateUser,
    deleteUser,
} from "../src/api/v1/controllers/userController";

jest.mock("../src/api/v1/middleware/authenticate", () =>
    jest.fn((req, res, next) => {
        if (!req.headers["authorization"]) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        next();
    })
);

jest.mock("../src/api/v1/middleware/authorize", () =>
    jest.fn(({ hasRole, allowSameUser }: { hasRole: string[]; allowSameUser?: boolean }) =>
        (req: Request, res: Response, next: NextFunction) => {
            const userRole = req.headers["x-roles"];
            const userId = req.headers["x-user-id"];

            if (Array.isArray(userRole)) {
                if (!userRole.some(role => hasRole.includes(role))) {
                    return res.status(403).json({ error: "Forbidden: Insufficient permissions" });
                }
            } else if (!userRole || !hasRole.includes(userRole)) {
                if (!allowSameUser || userId !== req.params.id) {
                    return res.status(403).json({ error: "Forbidden: Insufficient permissions" });
                }
            }
            next();
        })
);

jest.mock("../src/api/v1/controllers/userController", () => ({
    createUser: jest.fn((req, res) => res.status(201).json({ message: "User created successfully" })),
    getUserById: jest.fn((req, res) => res.status(200).json({ user: "John Doe" })),
    updateUser: jest.fn((req, res) => res.status(200).json({ message: "User updated successfully" })),
    deleteUser: jest.fn((req, res) => res.status(204).send()),
    setCustomClaims: jest.fn((req, res) => res.status(200).json({ message: "User role updated successfully" })),
}));

describe("User Routes", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("POST /api/v1/user", () => {
        it("should allow admins to create a user", async () => {
            const mockUser = {
                name: "John Doe",
                email: "johndoe@example.com",
                role: "Premium",
                healthMetrics: {
                    weight: 70,
                    height: 175,
                },
                workoutPreferences: {
                    daysAvailable: ["Monday", "Wednesday", "Friday"],
                    timePerDay: 60,
                    gymAccess: true,
                },
                background: {
                    experience: "Beginner",
                    routine: "Strength training",
                    goals: "Lose weight",
                },
            };

            const response = await request(app)
                .post("/api/v1/user")
                .set("authorization", "Bearer token")
                .set("x-roles", "admin")
                .send(mockUser);

            expect(response.status).toBe(201);
            expect(response.body.message).toBe("User created successfully");
            expect(createUser).toHaveBeenCalled();
        });
    });

    describe("GET /api/v1/user/:id", () => {
        it("should allow admins or the same user to retrieve user details", async () => {
            const userId = "user123";

            const response = await request(app)
                .get(`/api/v1/user/${userId}`)
                .set("authorization", "Bearer token")
                .set("x-roles", "admin");

            expect(response.status).toBe(200);
            expect(response.body.user).toBe("John Doe");
            expect(getUserById).toHaveBeenCalled();
        });
    });

    describe("PUT /api/v1/user/:id", () => {
        it("should allow admins or the same user to update user information", async () => {
            const userId = "user123";
            const updatedUser = {
                name: "John Smith",
                email: "johnsmith@example.com",
                role: "Trainer",
            };

            const response = await request(app)
                .put(`/api/v1/user/${userId}`)
                .set("authorization", "Bearer token")
                .set("x-roles", "admin")
                .send(updatedUser);

            expect(response.status).toBe(200);
            expect(response.body.message).toBe("User updated successfully");
            expect(updateUser).toHaveBeenCalled();
        });
    });

    describe("DELETE /api/v1/user/:id", () => {
        it("should allow admins or the same user to delete a user", async () => {
            const userId = "user123";

            const response = await request(app)
                .delete(`/api/v1/user/${userId}`)
                .set("authorization", "Bearer token")
                .set("x-roles", "admin");

            expect(response.status).toBe(204);
            expect(deleteUser).toHaveBeenCalled();
        });
    });
});
