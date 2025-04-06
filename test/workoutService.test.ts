import {
    createWorkout,
    getAllWorkoutsByUserId,
    getWorkoutById,
    updateWorkout,
    deleteWorkout,
} from "../src/api/v1/services/workoutService";
import {
    createDocument,
    getDocuments,
    updateDocument,
    deleteDocument,
    getDocumentById,
} from "../src/api/v1/repositories/firestoreRepository";
import { Workout } from "../src/api/v1/models/workoutModel";
import { Exercise } from "../src/api/v1/models/exerciseModel";
import { ServiceError } from "../src/api/v1/errors/errors";

jest.mock("../src/api/v1/repositories/firestoreRepository", () => ({
    createDocument: jest.fn(),
    getDocuments: jest.fn(),
    updateDocument: jest.fn(),
    deleteDocument: jest.fn(),
    getDocumentById: jest.fn(),
}));

describe("Workout Service", () => {
    describe("createWorkout", () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });

        it("should create a new workout and populate it with exercises", async () => {
            const mockWorkoutData: Partial<Workout> = { name: "Morning Routine" };
            const mockUserId = "user123";
            const mockExercisesSnapshot = {
                docs: [
                    {
                        id: "exercise1",
                        data: () => ({
                            name: "Push-ups",
                            equipment: [],
                            musclesWorked: ["Chest"],
                            intensity: "Medium",
                        }),
                    },
                    {
                        id: "exercise2",
                        data: () => ({
                            name: "Squats",
                            equipment: [],
                            musclesWorked: ["Legs"],
                            intensity: "High",
                        }),
                    },
                ],
            };
            const mockWorkoutId = "workout123";

            (createDocument as jest.Mock).mockResolvedValue(mockWorkoutId);
            (getDocuments as jest.Mock).mockResolvedValue(mockExercisesSnapshot);

            const result = await createWorkout(mockWorkoutData, mockUserId, 2);

            expect(createDocument).toHaveBeenCalledWith("Workouts", { ...mockWorkoutData, userId: mockUserId });
            expect(getDocuments).toHaveBeenCalledWith("ExerciseLibrary");
            expect(result.exercises).toHaveLength(2);
            expect(result.id).toEqual(mockWorkoutId);
        });

        it("should throw an error if user ID is missing", async () => {
            const mockWorkoutData: Partial<Workout> = { name: "Morning Routine" };

            await expect(createWorkout(mockWorkoutData, "", 2)).rejects.toThrow(
                new ServiceError("Failed to create workout: User ID is required to create a workout.", "VALIDATION_ERROR")
            );

            expect(createDocument).not.toHaveBeenCalled();
        });
    });

    describe("getAllWorkoutsByUserId", () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });

        it("should return workouts for the user", async () => {
            const mockDocs = [
                {
                    id: "workout1",
                    data: () => ({
                        name: "Workout 1",
                        userId: "user123",
                        exercises: [],
                    }),
                },
                {
                    id: "workout2",
                    data: () => ({
                        name: "Workout 2",
                        userId: "user456",
                        exercises: [],
                    }),
                },
            ];

            (getDocuments as jest.Mock).mockResolvedValue({ docs: mockDocs });

            const result = await getAllWorkoutsByUserId("user123");

            expect(getDocuments).toHaveBeenCalledWith("workouts");
            expect(result).toHaveLength(1);
            expect(result[0].userId).toBe("user123");
        });
    });

    describe("getWorkoutById", () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });

        it("should retrieve a workout by ID", async () => {
            const mockDoc = {
                id: "workout123",
                exists: true,
                data: () => ({
                    name: "Workout 1",
                    userId: "user123",
                    exercises: [],
                }),
            };

            (getDocumentById as jest.Mock).mockResolvedValue(mockDoc);

            const result = await getWorkoutById("workout123");

            expect(getDocumentById).toHaveBeenCalledWith("workouts", "workout123");
            expect(result).toEqual({ id: "workout123", name: "Workout 1", userId: "user123", exercises: [] });
        });

        it("should handle non-existent workout", async () => {
            const mockDoc = { id: "workout123", exists: false };

            (getDocumentById as jest.Mock).mockResolvedValue(mockDoc);

            await expect(getWorkoutById("workout123")).rejects.toThrow(
                new ServiceError("Failed to retrieve workout workout123: Workout with ID workout123 not found.", "ERROR_CODE")
            );

            expect(getDocumentById).toHaveBeenCalledWith("workouts", "workout123");
        });
    });

    describe("updateWorkout", () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });

        it("should update an existing workout", async () => {
            const id = "workout123";
            const mockWorkoutData: Partial<Workout> = { name: "Updated Workout" };

            (updateDocument as jest.Mock).mockResolvedValue(undefined);

            const result = await updateWorkout(id, mockWorkoutData);

            expect(updateDocument).toHaveBeenCalledWith("workouts", id, mockWorkoutData);
            expect(result).toEqual({ id, ...mockWorkoutData });
        });

        it("should handle update error", async () => {
            const id = "workout123";
            const mockWorkoutData: Partial<Workout> = { name: "Updated Workout" };
            const mockError = new Error("Update failed");

            (updateDocument as jest.Mock).mockRejectedValue(mockError);

            await expect(updateWorkout(id, mockWorkoutData)).rejects.toThrow(
                new ServiceError("Failed to update workout workout123: Update failed", "ERROR_CODE")
            );

            expect(updateDocument).toHaveBeenCalledWith("workouts", id, mockWorkoutData);
        });
    });

    describe("deleteWorkout", () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });

        it("should delete a workout by ID", async () => {
            const id = "workout123";

            (deleteDocument as jest.Mock).mockResolvedValue(undefined);

            await deleteWorkout(id);

            expect(deleteDocument).toHaveBeenCalledWith("workouts", id);
        });

        it("should handle delete error", async () => {
            const id = "workout123";
            const mockError = new Error("Deletion failed");

            (deleteDocument as jest.Mock).mockRejectedValue(mockError);

            await expect(deleteWorkout(id)).rejects.toThrow(
                new ServiceError("Failed to delete workout workout123: Deletion failed", "ERROR_CODE")
            );

            expect(deleteDocument).toHaveBeenCalledWith("workouts", id);
        });
    });
});
