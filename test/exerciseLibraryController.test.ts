import { Request, Response, NextFunction } from "express";
import * as exerciseLibraryController from "../src/api/v1/controllers/exerciseLibraryController";
import * as exerciseLibraryService from "../src/api/v1/services/exerciseLibraryService";
import { ExerciseLibrary } from "../src/api/v1/models/excersiseLibraryModel";
import { HTTP_STATUS } from "../src/constants/httpConstants";

jest.mock("../src/api/v1/services/exerciseLibraryService");

describe("Exercise Library Controller", () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let mockNext: NextFunction;

    beforeEach(() => {
        jest.clearAllMocks();
        mockReq = { body: {}, params: {}, query: {} };
        mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        mockNext = jest.fn();
    });

    describe("createExercise", () => {
        it("should handle successful creation", async () => {
            const mockNewExercise: ExerciseLibrary = {
                id: "1",
                name: "Squat",
                equipment: ["Barbell"],
                musclesWorked: ["Legs", "Glutes"],
                intensity: "High",
            };

            (exerciseLibraryService.createExercise as jest.Mock).mockResolvedValue(mockNewExercise);
            mockReq.body = {
                name: "Squat",
                equipment: ["Barbell"],
                musclesWorked: ["Legs", "Glutes"],
                intensity: "High",
            };

            await exerciseLibraryController.createExercise(mockReq as Request, mockRes as Response, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.CREATED);
            expect(mockRes.json).toHaveBeenCalledWith({
                status: "success",
                message: "Exercise Created",
                data: mockNewExercise,
            });
        });
    });

    describe("getAllExercises", () => {
        it("should handle successful retrieval", async () => {
            const mockExercises: ExerciseLibrary[] = [
                {
                    id: "1",
                    name: "Squat",
                    equipment: ["Barbell"],
                    musclesWorked: ["Legs", "Glutes"],
                    intensity: "High",
                },
            ];

            (exerciseLibraryService.getAllExercises as jest.Mock).mockResolvedValue(mockExercises);

            await exerciseLibraryController.getAllExercises(mockReq as Request, mockRes as Response, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith({
                status: "success",
                message: "Exercises Retrieved",
                data: mockExercises,
            });
        });
    });

    describe("getExerciseById", () => {
        it("should handle successful retrieval by ID", async () => {
            const mockExercise: ExerciseLibrary = {
                id: "1",
                name: "Squat",
                equipment: ["Barbell"],
                musclesWorked: ["Legs", "Glutes"],
                intensity: "High",
            };

            (exerciseLibraryService.getExerciseById as jest.Mock).mockResolvedValue(mockExercise);
            mockReq.params = { id: "1" };

            await exerciseLibraryController.getExerciseById(mockReq as Request, mockRes as Response, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith({
                status: "success",
                message: `Exercise with ID "1" retrieved successfully`,
                data: mockExercise,
            });
        });
    });

    describe("updateExercise", () => {
        it("should handle successful update", async () => {
            const updatedExercise: ExerciseLibrary = {
                id: "1",
                name: "Updated Squat",
                equipment: ["Updated Barbell"],
                musclesWorked: ["Legs", "Glutes"],
                intensity: "Medium",
            };

            (exerciseLibraryService.updateExercise as jest.Mock).mockResolvedValue(updatedExercise);
            mockReq.params = { id: "1" };
            mockReq.body = {
                name: "Updated Squat",
                equipment: ["Updated Barbell"],
                musclesWorked: ["Legs", "Glutes"],
                intensity: "Medium",
            };

            await exerciseLibraryController.updateExercise(mockReq as Request, mockRes as Response, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith({
                status: "success",
                message: "Exercise Updated",
                data: updatedExercise,
            });
        });
    });

    describe("deleteExercise", () => {
        it("should handle successful deletion", async () => {
            (exerciseLibraryService.deleteExercise as jest.Mock).mockResolvedValue(true);
            mockReq.params = { id: "1" };

            await exerciseLibraryController.deleteExercise(mockReq as Request, mockRes as Response, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith({
                status: "success",
                data: "Exercise Deleted",
            });
        });
    });
});
