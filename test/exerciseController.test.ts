import { Request, Response, NextFunction } from "express";
import * as exerciseController from "../src/api/v1/controllers/exerciseController";
import * as exerciseService from "../src/api/v1/services/exerciseService";
import { Exercise } from "../src/api/v1/models/exerciseModel";
import { HTTP_STATUS } from "../src/constants/httpConstants";

jest.mock("../src/api/v1/services/exerciseService");

describe("Exercise Controller", () => {
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
            const mockNewExercise: Exercise = {
                id: "1",
                workoutId: "123",
                userId: "123",
                name: "Push-up",
                equipment: ["Mat"],
                musclesWorked: ["Chest", "Triceps"],
                intensity: "Medium",
                sets: 5,
                reps: 15,
            };

            (exerciseService.createExercise as jest.Mock).mockResolvedValue(mockNewExercise);
            mockReq.body = {
                workoutId: "123",
                userId: "123",
                name: "Push-up",
                equipment: ["Mat"],
                musclesWorked: ["Chest", "Triceps"],
                intensity: "Medium",
                sets: 5,
                reps: 15,
            };

            await exerciseController.createExercise(mockReq as Request, mockRes as Response, mockNext);

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
            const mockExercises: Exercise[] = [
                {
                    id: "1",
                    workoutId: "123",
                    userId: "123",
                    name: "Push-up",
                    equipment: ["Mat"],
                    musclesWorked: ["Chest", "Triceps"],
                    intensity: "Medium",
                    sets: 5,
                    reps: 15,
                },
            ];
    
            (exerciseService.getAllExercises as jest.Mock).mockResolvedValue(mockExercises);
    
            mockReq.params = { workoutId: "123" };
    
            (mockRes.locals as any) = {
                uid: "123",
                role: "trainer"
            };
    
            await exerciseController.getAllExercises(mockReq as Request, mockRes as Response, mockNext);
    
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith({
                status: "success",
                message: "Exercises Retrieved",
                data: mockExercises,
            });
        });
    });
    

    describe("updateExercise", () => {
        it("should handle successful update", async () => {
            const updatedExercise: Exercise = {
                id: "1",
                workoutId: "123",
                userId: "123",
                name: "Updated Push-up",
                equipment: ["Updated Mat"],
                musclesWorked: ["Chest", "Triceps"],
                intensity: "High",
                sets: 5,
                reps: 20,
            };

            (exerciseService.updateExercise as jest.Mock).mockResolvedValue(updatedExercise);
            mockReq.params = { id: "1" };
            mockReq.body = {
                name: "Updated Push-up",
                userId: "123",
                equipment: ["Updated Mat"],
                intensity: "High",
                sets: 5,
                reps: 20,
            };

            await exerciseController.updateExercise(mockReq as Request, mockRes as Response, mockNext);

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
            (exerciseService.deleteExercise as jest.Mock).mockResolvedValue(true);
            mockReq.params = { id: "1" };

            await exerciseController.deleteExercise(mockReq as Request, mockRes as Response, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith({
                status: "success",
                data: "Exercise Deleted",
            });
        });
    });
});
