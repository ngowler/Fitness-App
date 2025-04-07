import {
    createExercise,
    getAllExercises,
    getExerciseById,
    updateExercise,
    deleteExercise,
} from "../src/api/v1/services/exerciseLibraryService";
import {
    createDocument,
    getDocuments,
    getDocumentById,
    updateDocument,
    deleteDocument,
} from "../src/api/v1/repositories/firestoreRepository";
import { ServiceError } from "../src/api/v1/errors/errors";
import { ExerciseLibrary } from "../src/api/v1/models/excersiseLibraryModel";

jest.mock("../src/api/v1/repositories/firestoreRepository", () => ({
    createDocument: jest.fn(),
    getDocuments: jest.fn(),
    getDocumentById: jest.fn(),
    updateDocument: jest.fn(),
    deleteDocument: jest.fn(),
}));

describe("Exercise Library Service", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("createExercise", () => {
        it("should create a new exercise", async () => {
            const mockExercise: Partial<ExerciseLibrary> = { name: "Push-Up" };
            (createDocument as jest.Mock).mockResolvedValue("exercise123");

            const result: ExerciseLibrary = await createExercise(mockExercise);

            expect(createDocument).toHaveBeenCalledWith("exercises", mockExercise);
            expect(result).toEqual({ id: "exercise123", ...mockExercise });
        });

        it("should handle creation errors", async () => {
            (createDocument as jest.Mock).mockRejectedValue(new Error("Create error"));

            await expect(createExercise({} as Partial<ExerciseLibrary>)).rejects.toThrow(ServiceError);
        });
    });

    describe("getAllExercises", () => {
        it("should retrieve all exercises", async () => {
            const mockSnapshot: FirebaseFirestore.QuerySnapshot = {
                docs: [
                    {
                        id: "exercise1",
                        data: (): ExerciseLibrary => ({
                            name: "Push-Up",
                            equipment: [],
                            musclesWorked: [],
                            intensity: "Low",
                        }),
                    },
                ],
            } as unknown as FirebaseFirestore.QuerySnapshot;

            (getDocuments as jest.Mock).mockResolvedValue(mockSnapshot);

            const result: ExerciseLibrary[] = await getAllExercises({ intensity: "Low" });

            expect(getDocuments).toHaveBeenCalledWith("exercises");
            expect(result).toEqual([
                {
                    id: "exercise1",
                    name: "Push-Up",
                    equipment: [],
                    musclesWorked: [],
                    intensity: "Low",
                },
            ]);
        });

        it("should handle retrieval errors", async () => {
            (getDocuments as jest.Mock).mockRejectedValue(new Error("Retrieve error"));

            await expect(getAllExercises({ intensity: "Low" })).rejects.toThrow(ServiceError);
        });
    });

    describe("getExerciseById", () => {
        it("should retrieve an exercise by ID", async () => {
            const mockDoc: FirebaseFirestore.DocumentSnapshot = {
                exists: true,
                id: "exercise1",
                data: (): Partial<ExerciseLibrary> => ({ name: "Push-Up" }),
            } as unknown as FirebaseFirestore.DocumentSnapshot;

            (getDocumentById as jest.Mock).mockResolvedValue(mockDoc);

            const result: ExerciseLibrary = await getExerciseById("exercise1");

            expect(getDocumentById).toHaveBeenCalledWith("exercises", "exercise1");
            expect(result).toEqual({ id: "exercise1", name: "Push-Up" });
        });

        it("should handle non-existent documents", async () => {
            const mockDoc: FirebaseFirestore.DocumentSnapshot = { exists: false } as FirebaseFirestore.DocumentSnapshot;

            (getDocumentById as jest.Mock).mockResolvedValue(mockDoc);

            await expect(getExerciseById("exercise1")).rejects.toThrow(ServiceError);
        });

        it("should handle retrieval errors", async () => {
            (getDocumentById as jest.Mock).mockRejectedValue(new Error("Retrieve error"));

            await expect(getExerciseById("exercise1")).rejects.toThrow(ServiceError);
        });
    });

    describe("updateExercise", () => {
        it("should update an exercise", async () => {
            const mockExercise: Partial<ExerciseLibrary> = { name: "Pull-Up" };
            (updateDocument as jest.Mock).mockResolvedValue(undefined);

            const result: ExerciseLibrary = await updateExercise("exercise1", mockExercise);

            expect(updateDocument).toHaveBeenCalledWith("exercises", "exercise1", mockExercise);
            expect(result).toEqual({ id: "exercise1", ...mockExercise });
        });

        it("should handle update errors", async () => {
            (updateDocument as jest.Mock).mockRejectedValue(new Error("Update error"));

            await expect(updateExercise("exercise1", {} as Partial<ExerciseLibrary>)).rejects.toThrow(ServiceError);
        });
    });

    describe("deleteExercise", () => {
        it("should delete an exercise", async () => {
            (deleteDocument as jest.Mock).mockResolvedValue(undefined);

            await deleteExercise("exercise1");

            expect(deleteDocument).toHaveBeenCalledWith("exercises", "exercise1");
        });

        it("should handle deletion errors", async () => {
            (deleteDocument as jest.Mock).mockRejectedValue(new Error("Delete error"));

            await expect(deleteExercise("exercise1")).rejects.toThrow(ServiceError);
        });
    });
});
