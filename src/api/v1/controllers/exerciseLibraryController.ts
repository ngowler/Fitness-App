import { Request, Response, NextFunction } from "express";
import * as exerciseService from "../services/exerciseService";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import { ExerciseLibrary } from "../models/excersiseLibraryModel"
import { successResponse } from "../models/responseModel";

export const createExercise = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const newExercise: ExerciseLibrary = await exerciseService.createExercise(req.body);

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
        const exercises: ExerciseLibrary[] = await exerciseService.getAllExercises(req.query);

        res.status(HTTP_STATUS.OK).json(
            successResponse(exercises, "Exercises Retrieved")
        );
    } catch (error) {
        next(error);
    }
};

export const getExerciseById = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;
        const exercise: ExerciseLibrary = await exerciseService.getExerciseById(id);

        res.status(HTTP_STATUS.OK).json(
            successResponse(exercise, `Exercise with ID "${id}" retrieved successfully`)
        );
    } catch (error) {
        next(error);
    }
};

export const updateExercise = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const updatedExercise: ExerciseLibrary = await exerciseService.updateExercise(
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
