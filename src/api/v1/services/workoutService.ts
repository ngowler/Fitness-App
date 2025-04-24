import {
    getDocuments,
    createDocument,
    updateDocument,
    deleteDocument,
    getDocumentById,
} from "../repositories/firestoreRepository";
import { createExercise } from "./exerciseService";
import { Workout } from "../models/workoutModel";
import { Exercise } from "../models/exerciseModel";
import { ExerciseLibrary } from "../models/excersiseLibraryModel";
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
    exerciseLibraryIds: string[]
): Promise<Workout> => {
    try {
        // Validate required fields
        if (!userId) {
            throw new Error("User ID is required to create a workout.");
        }

        if (!workoutData.name) {
            throw new Error("Workout name is required.");
        }

        if (!workoutData.date) {
            throw new Error("Workout date is required.");
        }

        // Create the workout document first to get a valid workoutId
        const workoutWithUserId: Partial<Workout> = {
            userId,
            name: workoutData.name,
            description: workoutData.description,
            date: workoutData.date,
            exercises: [], // Placeholder exercises
        };

        const workoutId: string = await createDocument("Workouts", workoutWithUserId);
        console.log(`Workout created with ID: ${workoutId}`);

        // Double-check workout existence to ensure Firestore consistency
        const workoutSnapshot = await getDocumentById("Workouts", workoutId);
        if (!workoutSnapshot.exists) {
            throw new Error(`Workout with ID ${workoutId} not found after creation.`);
        }

        // Fetch exercises from ExerciseLibrary using the provided IDs
        const exercisesSnapshot: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData> =
            await getDocuments("exercise-library");
        const allExercises: ExerciseLibrary[] = exercisesSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as ExerciseLibrary[];

        const selectedExercises: ExerciseLibrary[] = exerciseLibraryIds
            .map((id) => allExercises.find((exercise) => exercise.id === id))
            .filter((exercise): exercise is ExerciseLibrary => !!exercise);

        if (selectedExercises.length === 0) {
            throw new Error("No exercises found for the provided IDs.");
        }

        // Create exercises and associate them with the workout
        const workoutExercises: Exercise[] = await Promise.all(
            selectedExercises.map(async (exercise) => {
                return await createExercise({
                    name: exercise.name,
                    equipment: exercise.equipment,
                    musclesWorked: exercise.musclesWorked,
                    intensity: exercise.intensity,
                    workoutId, // Pass the confirmed workoutId
                    sets: 4,
                    reps: 12,
                });
            })
        );

        // Update the workout document with the created exercises
        await updateDocument("Workouts", workoutId, { exercises: workoutExercises });

        // Return the complete workout
        return {
            id: workoutId,
            ...workoutWithUserId,
            exercises: workoutExercises,
        } as Workout;
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
        const snapshot: FirebaseFirestore.QuerySnapshot = await getDocuments(COLLECTION);
        const workouts: Workout[] = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Workout[];
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
        const doc: FirebaseFirestore.DocumentSnapshot = await getDocumentById(COLLECTION, id);

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
