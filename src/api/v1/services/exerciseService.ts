import {
    getDocuments,
    createDocument,
    updateDocument,
    deleteDocument,
    getDocumentById,
} from "../repositories/firestoreRepository";
import { Exercise } from "../models/exerciseModel";
import { ServiceError } from "../errors/errors";
import { getErrorMessage, getErrorCode } from "../utils/errorUtils";

const COLLECTION: string = "exercises";

/**
 * Create a new exercise given the request data.
 * The exercise must include a workoutId and userId,
 * so that it is tied to a specific workout and user.
 * @param {Partial<Exercise>} exerciseData - The data for the new exercise.
 * @returns {Promise<Exercise>}
 */
export const createExercise = async (
    exerciseData: Partial<Exercise>
): Promise<Exercise> => {
    try {
        if (!exerciseData.userId) {
            throw new Error("User ID is required to create an exercise.");
        }

        if (exerciseData.workoutId) {
            const workoutSnapshot = await getDocumentById("workouts", exerciseData.workoutId);
            if (!workoutSnapshot.exists) {
                throw new Error(`Workout with ID ${exerciseData.workoutId} not found.`);
            }
        }

        const exerciseId: string = await createDocument(COLLECTION, exerciseData);
        const newExercise: Exercise = { id: exerciseId, ...exerciseData } as Exercise;

        return newExercise;
    } catch (error: unknown) {
        throw new ServiceError(
            `Failed to create exercise: ${getErrorMessage(error)}`,
            getErrorCode(error)
        );
    }
};

/**
 * Get all exercises for a specific workout.
 * @param {string | undefined} workoutId - The ID of the workout (optional).
 * @returns {Promise<Exercise[]>}
 */
export const getAllExercises = async (
    workoutId?: string, 
    userId?: string, 
    userRole?: string
): Promise<Exercise[]> => {
    try {
        const snapshot: FirebaseFirestore.QuerySnapshot = await getDocuments(COLLECTION);
        let exercises: Exercise[] = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Exercise[];

        if (userRole !== "trainer") {
            exercises = exercises.filter((exercise) => exercise.userId === userId);
        }

        if (workoutId) {
            exercises = exercises.filter((exercise) => exercise.workoutId === workoutId);
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
