import { Request, Response, NextFunction } from "express";
import * as workoutService from "../services/workoutService";
import { Workout } from "../models/workoutModel";
import { successResponse } from "../models/responseModel";
import { HTTP_STATUS } from "../../../constants/httpConstants";

/**
 * @description Create a new workout.
 * @route POST /workout/
 * @returns {Promise<void>}
 */
export const createWorkout = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { workoutData, exerciseLibraryIds } = req.body;

        const newWorkout: Workout = await workoutService.createWorkout(workoutData, exerciseLibraryIds);

        res.status(HTTP_STATUS.CREATED).json(
            successResponse(newWorkout, "Workout Created")
        );
    } catch (error) {
        next(error);
    }
};


/**
 * @description Retrieve all workouts for the authenticated user.
 * @route GET /workout/
 * @returns {Promise<void>}
 */
export const getAllWorkouts = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId = res.locals.uid;

        if (!userId) {
            res.status(400).json({ message: "User ID is missing" });
            return;
        }

        const workouts: Workout[] = await workoutService.getAllWorkoutsByUserId(userId);

        res.status(HTTP_STATUS.OK).json(
            successResponse(workouts, "Workouts Retrieved")
        );
    } catch (error) {
        next(error);
    }
};

/**
 * @description Retrieve a specific workout by ID.
 * @route GET /workout/:id
 * @returns {Promise<void>}
 */
export const getWorkoutById = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;

        const workout: Workout = await workoutService.getWorkoutById(id);

        res.status(HTTP_STATUS.OK).json(
            successResponse(
                workout,
                `Workout with ID "${id}" retrieved successfully`
            )
        );
    } catch (error) {
        next(error);
    }
};

/**
 * @description Edit a workout.
 * @route PUT /workout/:id
 * @returns {Promise<void>}
 */
export const updateWorkout = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const updatedWorkout: Workout = await workoutService.updateWorkout(
            req.params.id,
            req.body
        );

        res.status(HTTP_STATUS.OK).json(
            successResponse(updatedWorkout, "Workout Updated")
        );
    } catch (error) {
        next(error);
    }
};

/**
 * @description Delete a workout.
 * @route DELETE /workout/:id
 * @returns {Promise<void>}
 */
export const deleteWorkout = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        await workoutService.deleteWorkout(req.params.id);

        res.status(HTTP_STATUS.OK).json(successResponse("Workout Deleted"));
    } catch (error) {
        next(error);
    }
};
