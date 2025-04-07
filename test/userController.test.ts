import { Request, Response, NextFunction } from "express";
import * as userController from "../src/api/v1/controllers/userController";
import * as userService from "../src/api/v1/services/userService";
import { User } from "../src/api/v1/models/userModel";
import { HTTP_STATUS } from "../src/constants/httpConstants";

jest.mock("../src/api/v1/services/userService");

describe("User Controller", () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let mockNext: NextFunction;

    beforeEach(() => {
        jest.clearAllMocks();
        mockReq = { body: {}, params: {}, query: {} };
        mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn(), locals: {} };
        mockNext = jest.fn();
    });

    describe("createUser", () => {
        it("should handle successful user creation", async () => {
            const mockNewUser: User = {
                id: "1",
                name: "John Doe",
                email: "john.doe@example.com",
                role: "Lite",
                healthMetrics: { weight: 70, height: 175 },
                workoutPreferences: { daysAvailable: ["Monday", "Wednesday"], timePerDay: 60, gymAccess: true },
                background: { experience: "Beginner", routine: "None", goals: "Lose weight" },
            };

            (userService.createUser as jest.Mock).mockResolvedValue(mockNewUser);
            mockReq.body = {
                name: "John Doe",
                email: "john.doe@example.com",
                role: "Lite",
                healthMetrics: { weight: 70, height: 175 },
                workoutPreferences: { daysAvailable: ["Monday", "Wednesday"], timePerDay: 60, gymAccess: true },
                background: { experience: "Beginner", routine: "None", goals: "Lose weight" },
            };

            await userController.createUser(mockReq as Request, mockRes as Response, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.CREATED);
            expect(mockRes.json).toHaveBeenCalledWith({
                status: "success",
                message: "User Created",
                data: mockNewUser,
            });
        });
    });

    describe("getUserById", () => {
        it("should handle successful retrieval of user by ID", async () => {
            const mockUser: User = {
                id: "1",
                name: "John Doe",
                email: "john.doe@example.com",
                role: "Lite",
                healthMetrics: { weight: 70, height: 175 },
                workoutPreferences: { daysAvailable: ["Monday", "Wednesday"], timePerDay: 60, gymAccess: true },
                background: { experience: "Beginner", routine: "None", goals: "Lose weight" },
            };

            (userService.getUserById as jest.Mock).mockResolvedValue(mockUser);
            mockReq.params = { id: "1" };

            await userController.getUserById(mockReq as Request, mockRes as Response, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith({
                status: "success",
                message: `User with ID "1" retrieved successfully`,
                data: mockUser,
            });
        });
    });

    describe("updateUser", () => {
        it("should handle successful user update", async () => {
            const updatedUser: User = {
                id: "1",
                name: "John Doe",
                email: "john.doe@example.com",
                role: "Premium",
                healthMetrics: { weight: 70, height: 175 },
                workoutPreferences: { daysAvailable: ["Monday", "Wednesday"], timePerDay: 120, gymAccess: true },
                background: { experience: "Intermediate", routine: "Cardio", goals: "Build stamina" },
            };

            (userService.updateUser as jest.Mock).mockResolvedValue(updatedUser);
            mockReq.params = { id: "1" };
            mockReq.body = {
                role: "Premium",
                workoutPreferences: { timePerDay: 120 },
                background: { experience: "Intermediate", routine: "Cardio", goals: "Build stamina" },
            };

            await userController.updateUser(mockReq as Request, mockRes as Response, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith({
                status: "success",
                message: "User Updated",
                data: updatedUser,
            });
        });
    });

    describe("deleteUser", () => {
        it("should handle successful user deletion", async () => {
            (userService.deleteUser as jest.Mock).mockResolvedValue(true);
            mockReq.params = { id: "1" };

            await userController.deleteUser(mockReq as Request, mockRes as Response, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith({
                status: "success",
                data: "User Deleted",
            });
        });
    });
});
