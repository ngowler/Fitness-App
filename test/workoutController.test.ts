import { Request, Response, NextFunction } from "express";
import * as workoutController from "../src/api/v1/controllers/workoutController";
import * as workoutService from "../src/api/v1/services/workoutService";
import { Workout } from "../src/api/v1/models/workoutModel";
import { HTTP_STATUS } from "../src/constants/httpConstants";

jest.mock("../src/api/v1/services/workoutService");

describe("Workout Controller", () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let mockNext: NextFunction;

    beforeEach(() => {
        jest.clearAllMocks();
        mockReq = { body: {}, params: {}, query: {} };
        mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn(), locals: {} };
        mockNext = jest.fn();
    });

    describe("createWorkout", () => {
        it("should handle successful workout creation", async () => {
            const mockNewWorkout: Workout = {
                id: "1",
                userId: "123",
                name: "Strength Training",
                description: "A workout for building muscle",
                date: "2025-04-05",
                exercises: [
                    {
                        id: "101",
                        name: "Squat",
                        equipment: ["Barbell"],
                        musclesWorked: ["Legs", "Glutes"],
                        intensity: "High",
                        sets: 5,
                        reps: 10,
                        workoutId: "workout123",
                    },
                ],
            };

            (workoutService.createWorkout as jest.Mock).mockResolvedValue(mockNewWorkout);
            mockReq.body = {
                workoutData: {
                    userId: "123",
                    name: "Strength Training",
                    description: "A workout for building muscle",
                    date: "2025-04-05",
                    exercises: [
                        {
                            id: "101",
                            name: "Squat",
                            equipment: ["Barbell"],
                            musclesWorked: ["Legs", "Glutes"],
                            intensity: "High",
                            sets: 5,
                            reps: 10,
                        },
                    ],
                },
                exerciseLibraryIds: ["101", "102"],
            };

            await workoutController.createWorkout(mockReq as Request, mockRes as Response, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.CREATED);
            expect(mockRes.json).toHaveBeenCalledWith({
                status: "success",
                message: "Workout Created",
                data: mockNewWorkout,
            });
        });
    });

    describe("getAllWorkouts", () => {
        it("should retrieve all workouts for a user", async () => {
            const mockWorkouts: Workout[] = [
                {
                    id: "1",
                    userId: "123",
                    name: "Strength Training",
                    description: "A workout for building muscle",
                    date: "2025-04-05",
                    exercises: [
                        {
                            id: "101",
                            name: "Squat",
                            equipment: ["Barbell"],
                            musclesWorked: ["Legs", "Glutes"],
                            intensity: "High",
                            sets: 5,
                            reps: 10,
                            workoutId: "workout123",
                        },
                    ],
                },
            ];

            (workoutService.getAllWorkoutsByUserId as jest.Mock).mockResolvedValue(mockWorkouts);
            mockRes.locals = { uid: "123" };

            await workoutController.getAllWorkouts(mockReq as Request, mockRes as Response, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith({
                status: "success",
                message: "Workouts Retrieved",
                data: mockWorkouts,
            });
        });

        it("should return an error if user ID is missing", async () => {
            mockRes.locals = {};

            await workoutController.getAllWorkouts(mockReq as Request, mockRes as Response, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({ message: "User ID is missing" });
        });
    });

    describe("getWorkoutById", () => {
        it("should handle successful retrieval of a workout by ID", async () => {
            const mockWorkout: Workout = {
                id: "1",
                userId: "123",
                name: "Strength Training",
                description: "A workout for building muscle",
                date: "2025-04-05",
                exercises: [
                    {
                        id: "101",
                        name: "Squat",
                        equipment: ["Barbell"],
                        musclesWorked: ["Legs", "Glutes"],
                        intensity: "High",
                        sets: 5,
                        reps: 10,
                        workoutId: "workout123",
                    },
                ],
            };

            (workoutService.getWorkoutById as jest.Mock).mockResolvedValue(mockWorkout);
            mockReq.params = { id: "1" };

            await workoutController.getWorkoutById(mockReq as Request, mockRes as Response, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith({
                status: "success",
                message: `Workout with ID "1" retrieved successfully`,
                data: mockWorkout,
            });
        });
    });

    describe("updateWorkout", () => {
        it("should handle successful workout update", async () => {
            const updatedWorkout: Workout = {
                id: "1",
                userId: "123",
                name: "Strength Training - Updated",
                description: "An updated workout for building muscle",
                date: "2025-04-06",
                exercises: [
                    {
                        id: "101",
                        name: "Squat",
                        equipment: ["Barbell"],
                        musclesWorked: ["Legs", "Glutes"],
                        intensity: "High",
                        sets: 5,
                        reps: 10,
                        workoutId: "workout123",
                    },
                ],
            };

            (workoutService.updateWorkout as jest.Mock).mockResolvedValue(updatedWorkout);
            mockReq.params = { id: "1" };
            mockReq.body = {
                name: "Strength Training - Updated",
                description: "An updated workout for building muscle",
                date: "2025-04-06",
                exercises: [
                    {
                        id: "101",
                        name: "Squat",
                        equipment: ["Barbell"],
                        musclesWorked: ["Legs", "Glutes"],
                        intensity: "High",
                        duration: 60,
                        reps: 12,
                    },
                ],
            };

            await workoutController.updateWorkout(mockReq as Request, mockRes as Response, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith({
                status: "success",
                message: "Workout Updated",
                data: updatedWorkout,
            });
        });
    });

    describe("deleteWorkout", () => {
        it("should handle successful workout deletion", async () => {
            (workoutService.deleteWorkout as jest.Mock).mockResolvedValue(true);
            mockReq.params = { id: "1" };

            await workoutController.deleteWorkout(mockReq as Request, mockRes as Response, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith({
                status: "success",
                data: "Workout Deleted",
            });
        });
    });
});
