import {
    getDocuments,
    createDocument,
    updateDocument,
    deleteDocument,
    getDocumentById,
} from "../repositories/firestoreRepository";
import { Exercise } from "../models/exerciseModel";
import { Workout } from "../models/workoutModel";
import { ServiceError } from "../errors/errors";
import { getErrorMessage, getErrorCode } from "../utils/errorUtils";

const COLLECTION: string = "exercises";

/**
 * Create a new exercise for a workout and update the workout's exercises list.
 * @param {Partial<Exercise>} exerciseData - The data for the new exercise.
 * @returns {Promise<Exercise>}
 */
export const createExercise = async (exerciseData: Partial<Exercise>): Promise<Exercise> => {
    try {
        if (!exerciseData.workoutId) {
            throw new Error("Workout ID is required to create an exercise");
        }

        const id: string = await createDocument("Exercise", exerciseData);
        const newExercise: Exercise = { id, ...exerciseData } as Exercise;

        const workoutSnapshot: FirebaseFirestore.DocumentSnapshot = await getDocumentById("Workout", exerciseData.workoutId);
        if (!workoutSnapshot.exists) {
            throw new Error(`Workout with ID ${exerciseData.workoutId} not found`);
        }

        const workoutData: Workout = workoutSnapshot.data() as Workout;

        const updatedExercises: Exercise[] = [...workoutData.exercises, newExercise];
        await updateDocument("Workout", exerciseData.workoutId, { exercises: updatedExercises });

        return newExercise;
    } catch (error: unknown) {
        throw new ServiceError(
            `Failed to create exercise and update workout: ${getErrorMessage(error)}`,
            getErrorCode(error)
        );
    }
};

/**
 * Get all exercises for a specific workout.
 * @param {string | undefined} workoutId - The ID of the workout (optional).
 * @returns {Promise<Exercise[]>}
 */
export const getAllExercises = async (workoutId?: string): Promise<Exercise[]> => {
    try {
        const snapshot: FirebaseFirestore.QuerySnapshot = await getDocuments(COLLECTION);
        const exercises: Exercise[] = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Exercise[];

        if (workoutId) {
            return exercises.filter((exercise) => exercise.workoutId === workoutId);
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
 * Get a specific exercise by ID.
 * @param {string} id - The ID of the exercise.
 * @returns {Promise<Exercise>}
 */
export const getExerciseById = async (id: string): Promise<Exercise> => {
    try {
        const doc: FirebaseFirestore.DocumentSnapshot = await getDocumentById(COLLECTION, id);

        if (!doc.exists) {
            throw new Error(`Exercise with ID ${id} not found.`);
        }

        return { id, ...doc.data() } as Exercise;
    } catch (error: unknown) {
        throw new ServiceError(
            `Failed to retrieve exercise ${id}: ${getErrorMessage(error)}`,
            getErrorCode(error)
        );
    }
};

/**
 * Update an existing exercise.
 * @param {string} id - The ID of the exercise.
 * @param {Partial<Exercise>} exerciseData - The updated exercise data.
 * @returns {Promise<Exercise>}
 */
export const updateExercise = async (id: string, exerciseData: Partial<Exercise>): Promise<Exercise> => {
    try {
        await updateDocument(COLLECTION, id, exerciseData);
        return { id, ...exerciseData } as Exercise;
    } catch (error: unknown) {
        throw new ServiceError(
            `Failed to update exercise ${id}: ${getErrorMessage(error)}`,
            getErrorCode(error)
        );
    }
};

/**
 * Delete an exercise by ID.
 * @param {string} id - The ID of the exercise.
 * @returns {Promise<void>}
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
