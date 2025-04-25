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
 * Create a new workout. Exercises can be selected based on provided exercise IDs.
 *
 * After selecting the desired library exercises, create an exercise document for each,
 * ensuring each new exercise is tied to the workout (via workoutId) and the user (via userId),
 * then update the workout with the list of created exercises.
 *
 * @param {Partial<Workout>} workoutData - The basic data for the new workout (name, description, etc.).
 * @param {string} userId - The ID of the authenticated user creating the workout.
 * @param {string[]} exerciseLibraryIds - Specifies which exercises to add to the workout.
 * @returns {Promise<Workout>}
 */
export const createWorkout = async (
    workoutData: Partial<Workout>,
    userId: string,
    exerciseLibraryIds: string[]
  ): Promise<Workout> => {
    try {
      if (!userId) {
        throw new Error("User ID is required to create a workout.");
      }
      if (!workoutData.name) {
        throw new Error("Workout name is required.");
      }
  
      // Use the current date if none is provided
      const workoutDate: string = workoutData.date ?? new Date().toISOString();
  
      const workoutWithUserId: Partial<Workout> = {
        userId,
        name: workoutData.name,
        description: workoutData.description,
        date: workoutDate,
        exercises: [],
      };
  
      const workoutId: string = await createDocument(COLLECTION, workoutWithUserId);
  
      const workoutSnapshot = await getDocumentById(COLLECTION, workoutId);
      if (!workoutSnapshot.exists) {
        throw new Error(`Workout with ID ${workoutId} not found after creation.`);
      }
  
      const exercisesSnapshot = await getDocuments("exercise-library");
      const allLibraryExercises: ExerciseLibrary[] = exercisesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as ExerciseLibrary[];
  
      // Map the provided exerciseLibraryIds to library exercises
      const selectedExercises: ExerciseLibrary[] = exerciseLibraryIds
        .map((id) => allLibraryExercises.find((exercise) => exercise.id === id))
        .filter((exercise): exercise is ExerciseLibrary => !!exercise);
  
      if (selectedExercises.length === 0) {
        throw new Error("No valid exercises found for the provided IDs.");
      }
  
      const createdExercises: Exercise[] = await Promise.all(
        selectedExercises.map(async (libEx) => {
          const newExData: Partial<Exercise> = {
            name: libEx.name,
            equipment: libEx.equipment,
            musclesWorked: libEx.musclesWorked,
            intensity: libEx.intensity,
            workoutId,
            userId,
            sets: 4,
            reps: 12,
          };
          return await createExercise(newExData);
        })
      );
  
      // Update the workout document to include the created exercises
      await updateDocument(COLLECTION, workoutId, { exercises: createdExercises });
  
      // Return the complete workout object
      return {
        id: workoutId,
        ...workoutWithUserId,
        exercises: createdExercises,
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
