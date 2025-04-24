import {
    createExercise,
    getAllExercises,
    getExerciseById,
    updateExercise,
    deleteExercise,
} from "../src/api/v1/services/exerciseService";
import {
    getDocuments,
    createDocument,
    updateDocument,
    deleteDocument,
    getDocumentById,
} from "../src/api/v1/repositories/firestoreRepository";
import { Exercise } from "../src/api/v1/models/exerciseModel";
import { Workout } from "../src/api/v1/models/workoutModel";
import { ServiceError } from "../src/api/v1/errors/errors";

jest.mock("../src/api/v1/repositories/firestoreRepository", () => ({
    getDocuments: jest.fn(),
    createDocument: jest.fn(),
    updateDocument: jest.fn(),
    deleteDocument: jest.fn(),
    getDocumentById: jest.fn(),
}));

describe("Exercise Service", () => {
    describe("createExercise", () => {
        beforeEach((): void => {
            jest.clearAllMocks();
        });

        it("should create a new exercise and update workout exercises list", async (): Promise<void> => {
            const mockExerciseData: Partial<Exercise> = {
                workoutId: "workout123",
                name: "Push-ups",
            };

            const mockWorkoutData: Workout = {
                id: "workout123",
                userId: "user123",
                name: "Morning Routine",
                date: new Date().toISOString(),
                exercises: [],
            };

            (createDocument as jest.Mock).mockResolvedValue("exercise123");
            (getDocumentById as jest.Mock).mockResolvedValue({
                exists: true,
                data: (): Workout => mockWorkoutData,
            });
            (updateDocument as jest.Mock).mockResolvedValue(undefined);

            const result: Exercise = await createExercise(mockExerciseData);

            expect(createDocument).toHaveBeenCalledWith("exercises", mockExerciseData);
            expect(getDocumentById).toHaveBeenCalledWith("workouts", mockExerciseData.workoutId);
            expect(updateDocument).toHaveBeenCalledWith("workouts", mockExerciseData.workoutId, {
                exercises: [{ id: "exercise123", ...mockExerciseData }],
            });
            expect(result).toEqual({ id: "exercise123", ...mockExerciseData });
        });

        it("should throw an error if workout ID is missing", async (): Promise<void> => {
            const mockExerciseData: Partial<Exercise> = { name: "Push-ups" };
        
            await expect(createExercise(mockExerciseData)).rejects.toThrow(
                new ServiceError(
                    "Failed to create exercise and update workout: Workout ID is required to create an exercise.",
                    "VALIDATION_ERROR"
                )
            );
        
            expect(createDocument).not.toHaveBeenCalled();
        });
    });

    describe("getAllExercises", () => {
        beforeEach((): void => {
            jest.clearAllMocks();
        });

        it("should retrieve all exercises", async (): Promise<void> => {
            const mockDocs: { id: string; data: () => Partial<Exercise> }[] = [
                {
                    id: "exercise123",
                    data: (): Partial<Exercise> => ({
                        workoutId: "workout123",
                        name: "Push-ups",
                    }),
                },
            ];

            (getDocuments as jest.Mock).mockResolvedValue({ docs: mockDocs });

            const result: Partial<Exercise>[] = await getAllExercises();

            expect(getDocuments).toHaveBeenCalledWith("exercises");
            expect(result).toHaveLength(1);
            expect(result[0]).toEqual({ id: "exercise123", workoutId: "workout123", name: "Push-ups" });
        });

        it("should filter exercises by workout ID", async (): Promise<void> => {
            const mockDocs: { id: string; data: () => Partial<Exercise> }[] = [
                {
                    id: "exercise123",
                    data: (): Partial<Exercise> => ({
                        workoutId: "workout123",
                        name: "Push-ups",
                    }),
                },
                {
                    id: "exercise456",
                    data: (): Partial<Exercise> => ({
                        workoutId: "workout456",
                        name: "Squats",
                    }),
                },
            ];

            (getDocuments as jest.Mock).mockResolvedValue({ docs: mockDocs });

            const result: Partial<Exercise>[] = await getAllExercises("workout123");

            expect(result).toHaveLength(1);
            expect(result[0].workoutId).toBe("workout123");
        });
    });

    describe("getExerciseById", () => {
        beforeEach((): void => {
            jest.clearAllMocks();
        });

        it("should retrieve exercise by ID", async (): Promise<void> => {
            const mockDoc: { id: string; exists: boolean; data: () => Partial<Exercise> } = {
                id: "exercise123",
                exists: true,
                data: (): Partial<Exercise> => ({
                    workoutId: "workout123",
                    name: "Push-ups",
                }),
            };

            (getDocumentById as jest.Mock).mockResolvedValue(mockDoc);

            const result: Partial<Exercise> = await getExerciseById("exercise123");

            expect(getDocumentById).toHaveBeenCalledWith("exercises", "exercise123");
            expect(result).toEqual({ id: "exercise123", workoutId: "workout123", name: "Push-ups" });
        });

        it("should handle non-existent exercise", async (): Promise<void> => {
            const mockDoc: { id: string; exists: boolean } = { id: "exercise123", exists: false };

            (getDocumentById as jest.Mock).mockResolvedValue(mockDoc);

            await expect(getExerciseById("exercise123")).rejects.toThrow(
                new ServiceError("Failed to retrieve exercise exercise123: Exercise with ID exercise123 not found.", "ERROR_CODE")
            );

            expect(getDocumentById).toHaveBeenCalledWith("exercises", "exercise123");
        });
    });

    describe("updateExercise", () => {
        beforeEach((): void => {
            jest.clearAllMocks();
        });

        it("should update an existing exercise", async (): Promise<void> => {
            const id: string = "exercise123";
            const mockExerciseData: Partial<Exercise> = { name: "Updated Push-ups" };

            (updateDocument as jest.Mock).mockResolvedValue(undefined);

            const result: Partial<Exercise> = await updateExercise(id, mockExerciseData);

            expect(updateDocument).toHaveBeenCalledWith("exercises", id, mockExerciseData);
            expect(result).toEqual({ id, ...mockExerciseData });
        });

        it("should handle update error", async (): Promise<void> => {
            const id: string = "exercise123";
            const mockExerciseData: Partial<Exercise> = { name: "Updated Push-ups" };
            const mockError: Error = new Error("Update error");

            (updateDocument as jest.Mock).mockRejectedValue(mockError);

            await expect(updateExercise(id, mockExerciseData)).rejects.toThrow(
                new ServiceError("Failed to update exercise exercise123: Update error", "ERROR_CODE")
            );

            expect(updateDocument).toHaveBeenCalledWith("exercises", id, mockExerciseData);
        });
    });

    describe("deleteExercise", () => {
        beforeEach((): void => {
            jest.clearAllMocks();
        });

        it("should delete an exercise", async (): Promise<void> => {
            const id: string = "exercise123";

            (deleteDocument as jest.Mock).mockResolvedValue(undefined);

            await deleteExercise(id);

            expect(deleteDocument).toHaveBeenCalledWith("exercises", id);
        });

        it("should handle delete error", async (): Promise<void> => {
            const id: string = "exercise123";
            const mockError: Error = new Error("Delete error");

            (deleteDocument as jest.Mock).mockRejectedValue(mockError);

            await expect(deleteExercise(id)).rejects.toThrow(
                new ServiceError("Failed to delete exercise exercise123: Delete error", "ERROR_CODE")
            );

            expect(deleteDocument).toHaveBeenCalledWith("exercises", id);
        });
    });
});
