import { Request, Response, NextFunction } from "express";
import { validate, validateRequest } from "../src/api/v1/middleware/validate";
import {
    postExerciseSchema,
    getExercisesByWorkoutSchema,
    getExerciseByIdSchema,
    putExerciseSchema,
    deleteExerciseSchema,
} from "../src/api/v1/validations/exerciseValidation";

describe("validate function for exercises", () => {
    interface Data {
        [key: string]: string | string[] | number;
    }

    describe("postExerciseSchema", () => {
        it("should not throw an error for valid exercise data", () => {
            const data: Data = {
                workoutId: "1",
                name: "Bench Press",
                equipment: ["Barbell"],
                musclesWorked: ["Chest", "Triceps"],
                intensity: "High",
                sets: 4,
                reps: 12,
            };
            expect(() => validate(postExerciseSchema, data)).not.toThrow();
        });

        it("should throw an error for invalid intensity", () => {
            const data: Data = {
                workoutId: "1",
                name: "Bench Press",
                equipment: ["Barbell"],
                musclesWorked: ["Chest", "Triceps"],
                intensity: "Extreme",
                sets: 3,
                reps: 10,
            };
            expect(() => validate(postExerciseSchema, data)).toThrow(
                "Intensity must be 'Low', 'Medium', or 'High'"
            );
        });
    });

    describe("getExerciseByIdSchema", () => {
        it("should not throw an error for valid ID", () => {
            const data: Data = { id: "1" };
            expect(() => validate(getExerciseByIdSchema, data)).not.toThrow();
        });

        it("should throw an error for missing ID", () => {
            const data: Data = {};
            expect(() => validate(getExerciseByIdSchema, data)).toThrow("Exercise ID is required");
        });
    });

    describe("putExerciseSchema", () => {
        it("should not throw an error for valid updated exercise data", () => {
            const data: Data = {
                id: "1",
                name: "Bench Press",
                intensity: "Medium",
            };
            expect(() => validate(putExerciseSchema, data)).not.toThrow();
        });

        it("should throw an error for missing ID", () => {
            const data: Data = {
                name: "Bench Press",
                intensity: "Medium",
            };
            expect(() => validate(putExerciseSchema, data)).toThrow("Exercise ID is required");
        });
    });

    describe("deleteExerciseSchema", () => {
        it("should not throw an error for valid ID", () => {
            const data: Data = { id: "1" };
            expect(() => validate(deleteExerciseSchema, data)).not.toThrow();
        });

        it("should throw an error for missing ID", () => {
            const data: Data = {};
            expect(() => validate(deleteExerciseSchema, data)).toThrow("Exercise ID is required");
        });
    });
});

describe("validateRequest middleware for exercises", () => {
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

    it("should not return an error for valid postExerciseSchema data", () => {
        const body: Record<string, unknown> = {
            workoutId: "1",
            name: "Bench Press",
            equipment: ["Barbell"],
            musclesWorked: ["Chest", "Triceps"],
            intensity: "High",
            sets: 3,
            reps: 10,
        };
        req.body = body;

        validateRequest(postExerciseSchema)(req as Request, res as Response, next);

        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });

    it("should return 400 for missing id in deleteExerciseSchema", () => {
        req.params = {};

        validateRequest(deleteExerciseSchema)(req as Request, res as Response, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: "Validation error: Exercise ID is required",
        });
    });
});
