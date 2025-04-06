import { Request, Response, NextFunction } from "express";
import { validate, validateRequest } from "../src/api/v1/middleware/validate";
import {
    postExerciseLibrarySchema,
    getFilteredExercisesSchema,
    getExerciseLibraryByIdSchema,
    putExerciseLibrarySchema,
    deleteExerciseLibrarySchema,
} from "../src/api/v1/validations/exerciseLibraryValidation";

describe("validate function for exercise library", () => {
    interface Data {
        [key: string]: string | string[] | Date;
    }

    describe("postExerciseLibrarySchema", () => {
        it("should not throw an error for valid exercise data", () => {
            const data: Data = {
                name: "Push-Up",
                equipment: ["None"],
                musclesWorked: ["Chest", "Triceps"],
                intensity: "Medium",
            };
            expect(() => validate(postExerciseLibrarySchema, data)).not.toThrow();
        });

        it("should throw an error for missing name", () => {
            const data: Data = {
                equipment: ["None"],
                musclesWorked: ["Chest", "Triceps"],
                intensity: "Medium",
            };
            expect(() => validate(postExerciseLibrarySchema, data)).toThrow("Exercise name is required");
        });

        it("should throw an error for invalid intensity", () => {
            const data: Data = {
                name: "Push-Up",
                equipment: ["None"],
                musclesWorked: ["Chest", "Triceps"],
                intensity: "Extreme",
            };
            expect(() => validate(postExerciseLibrarySchema, data)).toThrow(
                "Intensity must be one of 'Low', 'Medium', or 'High'"
            );
        });
    });

    describe("getFilteredExercisesSchema", () => {
        it("should not throw an error for valid filters", () => {
            const data: Data = {
                equipment: "Dumbbell",
                musclesWorked: "Biceps",
                intensity: "High",
            };
            expect(() => validate(getFilteredExercisesSchema, data)).not.toThrow();
        });

        it("should throw an error for invalid intensity filter", () => {
            const data: Data = {
                intensity: "Extreme",
            };
            expect(() => validate(getFilteredExercisesSchema, data)).toThrow(
                "Intensity filter must be one of 'Low', 'Medium', or 'High'"
            );
        });
    });

    describe("getExerciseLibraryByIdSchema", () => {
        it("should not throw an error for valid ID", () => {
            const data: Data = { id: "1" };
            expect(() => validate(getExerciseLibraryByIdSchema, data)).not.toThrow();
        });

        it("should throw an error for missing ID", () => {
            const data: Data = {};
            expect(() => validate(getExerciseLibraryByIdSchema, data)).toThrow("Exercise ID is required");
        });
    });

    describe("putExerciseLibrarySchema", () => {
        it("should not throw an error for valid exercise data", () => {
            const data: Data = {
                id: "1",
                name: "Push-Up",
                equipment: ["None"],
                musclesWorked: ["Chest", "Triceps"],
                intensity: "Medium",
            };
            expect(() => validate(putExerciseLibrarySchema, data)).not.toThrow();
        });

        it("should throw an error for missing ID", () => {
            const data: Data = {
                name: "Push-Up",
                equipment: ["None"],
                musclesWorked: ["Chest", "Triceps"],
                intensity: "Medium",
            };
            expect(() => validate(putExerciseLibrarySchema, data)).toThrow("Exercise ID is required");
        });
    });

    describe("deleteExerciseLibrarySchema", () => {
        it("should not throw an error for valid ID", () => {
            const data: Data = { id: "1" };
            expect(() => validate(deleteExerciseLibrarySchema, data)).not.toThrow();
        });

        it("should throw an error for missing ID", () => {
            const data: Data = {};
            expect(() => validate(deleteExerciseLibrarySchema, data)).toThrow("Exercise ID is required");
        });
    });
});

describe("validateRequest middleware for exercise library", () => {
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

    it("should not throw an error for valid postExerciseLibrarySchema data", () => {
        req.body = {
            name: "Push-Up",
            equipment: ["None"],
            musclesWorked: ["Chest", "Triceps"],
            intensity: "Medium",
        };

        validateRequest(postExerciseLibrarySchema)(req as Request, res as Response, next);

        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });

    it("should return 400 for missing name", () => {
        req.body = {
            equipment: ["None"],
            musclesWorked: ["Chest", "Triceps"],
            intensity: "Medium",
        };

        validateRequest(postExerciseLibrarySchema)(req as Request, res as Response, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: "Validation error: Exercise name is required",
        });
    });

    it("should not throw an error for valid getExerciseLibraryByIdSchema data", () => {
        req.params = { id: "1" };

        validateRequest(getExerciseLibraryByIdSchema)(req as Request, res as Response, next);

        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });

    it("should return 400 for missing id", () => {
        req.params = {};

        validateRequest(getExerciseLibraryByIdSchema)(req as Request, res as Response, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: "Validation error: Exercise ID is required",
        });
    });

    it("should not throw an error for valid deleteExerciseLibrarySchema data", () => {
        req.params = { id: "1" };

        validateRequest(deleteExerciseLibrarySchema)(req as Request, res as Response, next);

        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });

    it("should return 400 for missing id", () => {
        req.params = {};

        validateRequest(deleteExerciseLibrarySchema)(req as Request, res as Response, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: "Validation error: Exercise ID is required",
        });
    });
});
