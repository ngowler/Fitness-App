import request from "supertest";
import app from "../src/app";
import {
    createUser,
    getUserById,
    updateUser,
    deleteUser,
    setCustomClaims,
} from "../src/api/v1/controllers/userController";

jest.mock("../src/api/v1/controllers/userController", () => ({
    createUser: jest.fn((req, res) => res.status(201).send()),
    getUserById: jest.fn((req, res) => res.status(200).send()),
    updateUser: jest.fn((req, res) => res.status(200).send()),
    deleteUser: jest.fn((req, res) => res.status(204).send()),
    setCustomClaims: jest.fn((req, res) => res.status(200).send()),
}));

describe("User Routes", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("POST /api/v1/user", () => {
        it("should call createUser controller", async () => {
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

            await request(app)
                .post("/api/v1/user")
                .send(mockUser);

            expect(createUser).toHaveBeenCalled();
            expect(createUser).toHaveBeenCalledWith(expect.any(Object), expect.any(Object), expect.any(Function));
        });
    });

    describe("GET /api/v1/user/:id", () => {
        it("should call getUserById controller", async () => {
            const userId = "user123";

            await request(app).get(`/api/v1/user/${userId}`);

            expect(getUserById).toHaveBeenCalled();
            expect(getUserById).toHaveBeenCalledWith(expect.any(Object), expect.any(Object), expect.any(Function));
        });
    });

    describe("PUT /api/v1/user/:id", () => {
        it("should call updateUser controller", async () => {
            const userId = "user123";
            const updatedUser = {
                name: "John Smith",
                email: "johnsmith@example.com",
                role: "Trainer",
            };

            await request(app)
                .put(`/api/v1/user/${userId}`)
                .send(updatedUser);

            expect(updateUser).toHaveBeenCalled();
            expect(updateUser).toHaveBeenCalledWith(expect.any(Object), expect.any(Object), expect.any(Function));
        });
    });

    describe("DELETE /api/v1/user/:id", () => {
        it("should call deleteUser controller", async () => {
            const userId = "user123";

            await request(app).delete(`/api/v1/user/${userId}`);

            expect(deleteUser).toHaveBeenCalled();
            expect(deleteUser).toHaveBeenCalledWith(expect.any(Object), expect.any(Object), expect.any(Function));
        });
    });

    describe("POST /api/v1/user/:id/upgrade", () => {
        it("should call setCustomClaims controller", async () => {
            const userId = "user123";
            const roleUpdate = { id: userId, role: "Admin" };

            await request(app)
                .post(`/api/v1/user/${userId}/upgrade`)
                .send(roleUpdate);

            expect(setCustomClaims).toHaveBeenCalled();
            expect(setCustomClaims).toHaveBeenCalledWith(expect.any(Object), expect.any(Object), expect.any(Function));
        });
    });
});
