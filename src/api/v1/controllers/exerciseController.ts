import { Request, Response, NextFunction } from "express";
import * as exerciseService from "../services/exerciseService";
import { Exercise } from "../models/exerciseModel";
import { successResponse } from "../models/responseModel";
import { HTTP_STATUS } from "../../../constants/httpConstants";

/**
 * @description Create a new exercise for a workout.
 * @route POST /exercise/
 * @returns {Promise<void>}
 */
export const createExercise = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const newExercise: Exercise = await exerciseService.createExercise(req.body);

        res.status(HTTP_STATUS.CREATED).json(
            successResponse(newExercise, "Exercise Created")
        );
    } catch (error) {
        next(error);
    }
};

export const getAllExercises = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const workoutId: string | undefined = req.params.workoutId?.trim() || undefined;
        const userId: string = res.locals.uid;
        const userRole: string = res.locals.role;
  
        const exercises = await exerciseService.getAllExercises(
            workoutId,
            userId,
            userRole
        );
  
        res.status(HTTP_STATUS.OK).json(
            successResponse(exercises, "Exercises Retrieved")
        );
    } catch (error) {
        next(error);
    }
};
  
/**
 * @description Update an exercise in a workout.
 * @route PUT /exercise/:id
 * @returns {Promise<void>}
 */
export const updateExercise = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const updatedExercise: Exercise = await exerciseService.updateExercise(
            req.params.id,
            req.body
        );

        res.status(HTTP_STATUS.OK).json(
            successResponse(updatedExercise, "Exercise Updated")
        );
    } catch (error) {
        next(error);
    }
};

/**
 * @description Remove an exercise from a workout.
 * @route DELETE /exercise/:id
 * @returns {Promise<void>}
 */
export const deleteExercise = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        await exerciseService.deleteExercise(req.params.id);

        res.status(HTTP_STATUS.OK).json(successResponse("Exercise Deleted"));
    } catch (error) {
        next(error);
    }
};
