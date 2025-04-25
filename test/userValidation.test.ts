import { Request, Response, NextFunction } from "express";
import { validate, validateRequest } from "../src/api/v1/middleware/validate";
import {
    postUserSchema,
    getUserByIdSchema,
    putUserSchema,
    deleteUserSchema,
} from "../src/api/v1/validations/userValidation";

describe("validate function for users", () => {
    interface Data {
        [key: string]: string | number | boolean | string[] | object;
    }

    describe("postUserSchema", () => {
        it("should not throw an error for valid user data", () => {
            const data: Data = {
                name: "John Doe",
                email: "john.doe@example.com",
                password: "Secure123!",
                role: "Premium",
                healthMetrics: {
                    weight: 75,
                    height: 180,
                },
                workoutPreferences: {
                    daysAvailable: ["Monday", "Wednesday", "Friday"],
                    timePerDay: 60,
                    gymAccess: true,
                },
                background: {
                    experience: "Intermediate",
                    routine: "Strength training",
                    goals: "Build muscle",
                },
            };
            expect(() => validate(postUserSchema, data)).not.toThrow();
        });

        it("should throw an error for missing name", () => {
            const data: Data = {
                email: "john.doe@example.com",
                password: "Secure123!",
                role: "Premium",
            };
            expect(() => validate(postUserSchema, data)).toThrow("Name is required");
        });

        it("should throw an error for missing password", () => {
            const data: Data = {
                name: "John Doe",
                email: "john.doe@example.com",
                role: "Premium",
            };
            expect(() => validate(postUserSchema, data)).toThrow("Password is required");
        });

        it("should throw an error for invalid email format", () => {
            const data: Data = {
                name: "John Doe",
                email: "john.doe",
                password: "Secure123!",
                role: "Premium",
            };
            expect(() => validate(postUserSchema, data)).toThrow("Email must be valid");
        });
    });

    describe("getUserByIdSchema", () => {
        it("should not throw an error for valid user ID", () => {
            const data: Data = { uid: "1" };
            expect(() => validate(getUserByIdSchema, data)).not.toThrow();
        });

        it("should throw an error for missing user ID", () => {
            const data: Data = {};
            expect(() => validate(getUserByIdSchema, data)).toThrow("User uid is required");
        });
    });

    describe("putUserSchema", () => {
        it("should not throw an error for valid updated user data", () => {
            const data: Data = {
                uid: "1",
                name: "Jane Doe",
                email: "jane.doe@example.com",
            };
            expect(() => validate(putUserSchema, data)).not.toThrow();
        });

        it("should throw an error for missing user ID", () => {
            const data: Data = {
                name: "Jane Doe",
            };
            expect(() => validate(getUserByIdSchema, data)).toThrow("User uid is required");
        });
    });

    describe("deleteUserSchema", () => {
        it("should not throw an error for valid user ID", () => {
            const data: Data = { uid: "1" };
            expect(() => validate(deleteUserSchema, data)).not.toThrow();
        });

        it("should throw an error for missing user ID", () => {
            const data: Data = {};
            expect(() => validate(getUserByIdSchema, data)).toThrow("User uid is required");
        });
    });
});

describe("validateRequest middleware for users", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        req = { body: {}, params: {}, query: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
    });

    it("should not throw an error for valid postUserSchema data", () => {
        req.body = {
            name: "John Doe",
            email: "john.doe@example.com",
            password: "Secure123!",
            role: "Lite",
            healthMetrics: {
                weight: 65,
                height: 175,
            },
        };

        validateRequest(postUserSchema)(req as Request, res as Response, next);

        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });

    it("should return 400 for missing name", () => {
        req.body = {
            email: "john.doe@example.com",
            password: "Secure123!",
            role: "Lite",
        };

        validateRequest(postUserSchema)(req as Request, res as Response, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: expect.stringContaining("Name is required"),
        });
    });
});
