import {
    getDocuments,
    createDocument,
    updateDocument,
    deleteDocument,
    getDocumentById,
} from "../repositories/firestoreRepository";
import { Workout } from "../models/workoutModel";
import { ServiceError } from "../errors/errors";
import { getErrorMessage, getErrorCode } from "../utils/errorUtils";

const COLLECTION: string = "workouts";

/**
 * Create a new workout.
 * @param {Partial<Workout>} workoutData - The data for the new workout.
 * @returns {Promise<Workout>}
 */
export const createWorkout = async (workoutData: Partial<Workout>): Promise<Workout> => {
    try {
        const id = await createDocument(COLLECTION, workoutData);
        return { id, ...workoutData } as Workout;
    } catch (error: unknown) {
        throw new ServiceError(
            `Failed to create workout: ${getErrorMessage(error)}`,
            getErrorCode(error)
        );
    }
};

/**
 * Retrieve all workouts for the authenticated user.
 * @param {string} userId - The ID of the authenticated user.
 * @returns {Promise<Workout[]>}
 */
export const getAllWorkoutsByUserId = async (userId: string): Promise<Workout[]> => {
    try {
        const snapshot = await getDocuments(COLLECTION);
        const workouts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Workout[];
        return workouts.filter((workout) => workout.userId === userId);
    } catch (error: unknown) {
        throw new ServiceError(
            `Failed to retrieve workouts for user ${userId}: ${getErrorMessage(error)}`,
            getErrorCode(error)
        );
    }
};

/**
 * Retrieve a specific workout by ID.
 * @param {string} id - The ID of the workout.
 * @returns {Promise<Workout>}
 */
export const getWorkoutById = async (id: string): Promise<Workout> => {
    try {
        const doc = await getDocumentById(COLLECTION, id);

        if (!doc.exists) {
            throw new Error(`Workout with ID ${id} not found.`);
        }

        return { id, ...doc.data() } as Workout;
    } catch (error: unknown) {
        throw new ServiceError(
            `Failed to retrieve workout ${id}: ${getErrorMessage(error)}`,
            getErrorCode(error)
        );
    }
};

/**
 * Edit an existing workout.
 * @param {string} id - The ID of the workout to update.
 * @param {Partial<Workout>} workoutData - The updated workout data.
 * @returns {Promise<Workout>}
 */
export const updateWorkout = async (id: string, workoutData: Partial<Workout>): Promise<Workout> => {
    try {
        await updateDocument(COLLECTION, id, workoutData);
        return { id, ...workoutData } as Workout;
    } catch (error: unknown) {
        throw new ServiceError(
            `Failed to update workout ${id}: ${getErrorMessage(error)}`,
            getErrorCode(error)
        );
    }
};

/**
 * Delete a workout.
 * @param {string} id - The ID of the workout to delete.
 * @returns {Promise<void>}
 */
export const deleteWorkout = async (id: string): Promise<void> => {
    try {
        await deleteDocument(COLLECTION, id);
    } catch (error: unknown) {
        throw new ServiceError(
            `Failed to delete workout ${id}: ${getErrorMessage(error)}`,
            getErrorCode(error)
        );
    }
};
