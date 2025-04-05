import {
    getDocuments,
    createDocument,
    updateDocument,
    deleteDocument,
    getDocumentById,
} from "../repositories/firestoreRepository";
import { Workout } from "../models/workoutModel";
import { Exercise } from "../models/exerciseModel";
import { ServiceError } from "../errors/errors";
import { getErrorMessage, getErrorCode } from "../utils/errorUtils";

const COLLECTION: string = "workouts";

/**
 * Automatically generate a workout and populate it with exercises from the library.
 * @param {Partial<Workout>} workoutData - The data for the new workout (e.g., name, description).
 * @param {string} userId - The ID of the authenticated user creating the workout.
 * @param {number} numberOfExercises - The number of exercises to include in the workout.
 * @returns {Promise<Workout>}
 * @throws {ServiceError} Throws an error if any operation fails.
 */
export const createWorkout = async (
    workoutData: Partial<Workout>,
    userId: string,
    numberOfExercises: number = 5
): Promise<Workout> => {
    try {

        if (!userId) {
            throw new Error("User ID is required to create a workout.");
        }

        const workoutWithUserId: Partial<Workout> & { userId: string } = { ...workoutData, userId };
        const workoutId: string = await createDocument("Workouts", workoutWithUserId);
        const exercisesSnapshot: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData> = await getDocuments("ExerciseLibrary");

        const allExercises: Exercise[] = exercisesSnapshot.docs.map((doc) => {
            const exerciseData: Partial<Exercise> & { id: string } = { id: doc.id, ...doc.data() };
            if (!exerciseData.id) {
                throw new Error("Exercise ID is missing or invalid.");
            }
            return exerciseData as Exercise;
        });

        const selectedExercises: Exercise[] = [];
        const shuffledExercises = allExercises.sort(() => 0.5 - Math.random());
        for (let i = 0; i < Math.min(numberOfExercises, shuffledExercises.length); i++) {
            selectedExercises.push(shuffledExercises[i]);
        }

        const workoutExercises: Exercise[] = selectedExercises.map((exercise: Exercise) => ({
            ...exercise,
            workoutId,
            duration: 0,
            reps: 0,
        }));

        await Promise.all(
            workoutExercises.map((exerciseData: Exercise) =>
                createDocument("Exercise", exerciseData)
            )
        );

        return { id: workoutId, ...workoutWithUserId, exercises: workoutExercises } as Workout;
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
