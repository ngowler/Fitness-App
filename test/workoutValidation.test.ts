import { Request, Response, NextFunction } from "express";
import { validate, validateRequest } from "../src/api/v1/middleware/validate";
import {
    postWorkoutSchema,
    getWorkoutsByUserSchema,
    getWorkoutByIdSchema,
    putWorkoutSchema,
    deleteWorkoutSchema,
} from "../src/api/v1/validations/workoutValidation";

describe("validate function for workouts", () => {
    interface Data {
        [key: string]: string | string[] | number | object;
    }

    describe("postWorkoutSchema", () => {
        it("should not throw an error for valid workout data", () => {
            const data: Data = {
                name: "Morning Workout",
                description: "A quick workout to start the day",
                date: "2025-04-06T08:30:00Z",
                exerciseLibraryIds: ["lib1", "lib2"],
            };
            expect(() => validate(postWorkoutSchema, data)).not.toThrow();
        });

        it("should throw an error for missing required fields", () => {
            const data: Data = {
                date: "2025-04-06T08:30:00Z",
                exercises: [
                    {
                        name: "Push-Up",
                        equipment: ["None"],
                        musclesWorked: ["Chest", "Triceps"],
                        intensity: "Medium",
                        sets: 3,
                        reps: 15,
                    },
                ],
            };
            expect(() => validate(postWorkoutSchema, data)).toThrow(
                /Workout name is required.*Exercise Library IDs are required.*"exercises" is not allowed/
            );
        });

        it("should throw an error for missing exercises and library IDs", () => {
            const data: Data = {
                name: "Morning Workout",
                date: "2025-04-06T08:30:00Z",
            };
            expect(() => validate(postWorkoutSchema, data)).toThrow(
                /Exercise Library IDs are required/
            );
        });
    });

    describe("getWorkoutsByUserSchema", () => {
        it("should not throw an error for valid userId", () => {
            const data: Data = { userId: "1" };
            expect(() => validate(getWorkoutsByUserSchema, data)).not.toThrow();
        });

        it("should throw an error for missing userId", () => {
            const data: Data = {};
            expect(() => validate(getWorkoutsByUserSchema, data)).toThrow("User ID is required");
        });
    });

    describe("getWorkoutByIdSchema", () => {
        it("should not throw an error for valid workout ID", () => {
            const data: Data = { id: "1" };
            expect(() => validate(getWorkoutByIdSchema, data)).not.toThrow();
        });

        it("should throw an error for missing workout ID", () => {
            const data: Data = {};
            expect(() => validate(getWorkoutByIdSchema, data)).toThrow("Workout ID is required");
        });
    });

    describe("putWorkoutSchema", () => {
        it("should not throw an error for valid updated workout data", () => {
            const data: Data = {
                id: "1",
                name: "Evening Workout",
                date: "2025-04-06T19:00:00Z",
            };
            expect(() => validate(putWorkoutSchema, data)).not.toThrow();
        });

        it("should throw an error for missing workout ID", () => {
            const data: Data = {
                name: "Evening Workout",
            };
            expect(() => validate(putWorkoutSchema, data)).toThrow("Workout ID is required");
        });
    });

    describe("deleteWorkoutSchema", () => {
        it("should not throw an error for valid workout ID", () => {
            const data: Data = { id: "1" };
            expect(() => validate(deleteWorkoutSchema, data)).not.toThrow();
        });

        it("should throw an error for missing workout ID", () => {
            const data: Data = {};
            expect(() => validate(deleteWorkoutSchema, data)).toThrow("Workout ID is required");
        });
    });
});

describe("validateRequest middleware for workouts", () => {
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

    it("should not throw an error for valid postWorkoutSchema data", () => {
        req.body = {
            name: "Morning Workout",
            date: "2025-04-06T08:30:00Z",
            exerciseLibraryIds: ["abc123"],
        };

        validateRequest(postWorkoutSchema)(req as Request, res as Response, next);

        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });

    it("should return 400 for missing name and exerciseLibraryIds", () => {
        req.body = {
            date: "2025-04-06T08:30:00Z",
            exercises: [
                {
                    name: "Push-Up",
                    equipment: ["None"],
                    musclesWorked: ["Chest", "Triceps"],
                    intensity: "Medium",
                    sets: 3,
                    reps: 15,
                },
            ],
        };

        validateRequest(postWorkoutSchema)(req as Request, res as Response, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: expect.stringMatching(/Workout name is required.*Exercise Library IDs are required.*"exercises" is not allowed/),
        });
    });

    it("should not throw an error for valid deleteWorkoutSchema data", () => {
        req.params = { id: "1" };

        validateRequest(deleteWorkoutSchema)(req as Request, res as Response, next);

        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });

    it("should return 400 for missing workout ID", () => {
        req.params = {};

        validateRequest(deleteWorkoutSchema)(req as Request, res as Response, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: "Validation error: Workout ID is required",
        });
    });
});
