import {
    getDocuments,
    createDocument,
    updateDocument,
    deleteDocument,
    getDocumentById,
} from "../repositories/firestoreRepository";
import { ExerciseLibrary } from "../models/excersiseLibraryModel"
import { ServiceError } from "../errors/errors";
import { getErrorMessage, getErrorCode } from "../utils/errorUtils";

const COLLECTION: string = "exercises";

/**
 * @description Create a new exercise.
 * @param {Partial<ExerciseLibrary>} exercise - The exercise data.
 * @returns {Promise<ExerciseLibrary>}
 */
export const createExercise = async (exercise: Partial<ExerciseLibrary>): Promise<ExerciseLibrary> => {
    try {
        const id: string = await createDocument(COLLECTION, exercise);
        return { id, ...exercise } as ExerciseLibrary;
    } catch (error: unknown) {
        throw new ServiceError(
            `Failed to create exercise: ${getErrorMessage(error)}`,
            getErrorCode(error)
        );
    }
};

/**
 * @description Get all exercises.
 * @param {object} queryParams - Query parameters for filtering exercises. 
 * Optional filters include equipment, musclesWorked, and intensity.
 * @returns {Promise<ExerciseLibrary[]>} A promise that resolves to a list of exercises matching the filters.
 */
export const getAllExercises = async (queryParams: {
    equipment?: string[];
    musclesWorked?: string[];
    intensity?: "Low" | "Medium" | "High";
}): Promise<ExerciseLibrary[]> => {
    try {
        const snapshot: FirebaseFirestore.QuerySnapshot = await getDocuments(COLLECTION);
        let exercises: ExerciseLibrary[] = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as ExerciseLibrary[];

        if (queryParams.equipment) {
            exercises = exercises.filter((exercise) =>
                exercise.equipment.some((item) => queryParams.equipment!.includes(item))
            );
        }

        if (queryParams.musclesWorked) {
            exercises = exercises.filter((exercise) =>
                exercise.musclesWorked.some((muscle) => queryParams.musclesWorked!.includes(muscle))
            );
        }

        if (queryParams.intensity) {
            exercises = exercises.filter((exercise) => exercise.intensity === queryParams.intensity);
        }

        return exercises;
    } catch (error: unknown) {
        throw new ServiceError(
            `Failed to retrieve exercises: ${getErrorMessage(error)}`,
            getErrorCode(error)
        );
    }
};

/**
 * @description Get a specific exercise by ID.
 * @param {string} id - The ID of the exercise.
 * @returns {Promise<ExerciseLibrary>}
 * @throws {Error} If the exercise with the given ID is not found.
 */
export const getExerciseById = async (id: string): Promise<ExerciseLibrary> => {
    try {
        const doc: FirebaseFirestore.DocumentSnapshot = await getDocumentById(COLLECTION, id);

        if (!doc.exists) {
            throw new Error(`Failed to retrieve data for document with ID ${id}`);
        }

        return { id, ...doc.data() } as ExerciseLibrary;
    } catch (error: unknown) {
        throw new ServiceError(
            `Failed to retrieve exercise ${id}: ${getErrorMessage(error)}`,
            getErrorCode(error)
        );
    }
};

/**
 * @description Update an existing exercise.
 * @param {string} id - The ID of the exercise.
 * @param {Partial<ExerciseLibrary>} exercise - The updated exercise data.
 * @returns {Promise<ExerciseLibrary>}
 * @throws {Error} If the exercise with the given ID is not found.
 */
export const updateExercise = async (
    id: string,
    exercise: Partial<ExerciseLibrary>
): Promise<ExerciseLibrary> => {
    try {
        await updateDocument(COLLECTION, id, exercise);
        return { id, ...exercise } as ExerciseLibrary;
    } catch (error: unknown) {
        throw new ServiceError(
            `Failed to update exercise ${id}: ${getErrorMessage(error)}`,
            getErrorCode(error)
        );
    }
};

/**
 * @description Delete an exercise.
 * @param {string} id - The ID of the exercise.
 * @returns {Promise<void>}
 * @throws {Error} If the exercise with the given ID is not found.
 */
export const deleteExercise = async (id: string): Promise<void> => {
    try {
        await deleteDocument(COLLECTION, id);
    } catch (error: unknown) {
        throw new ServiceError(
            `Failed to delete exercise ${id}: ${getErrorMessage(error)}`,
            getErrorCode(error)
        );
    }
};
