import { Request, Response, NextFunction } from "express";
import * as userService from "../services/userService";
import { User } from "../models/userModel";
import { successResponse } from "../models/responseModel";
import { HTTP_STATUS } from "../../../constants/httpConstants";

/**
 * @description Create a new user.
 * @route POST /user/
 * @returns {Promise<void>}
 */
export const createUser = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const newUser: User = await userService.createUser(req.body);

        res.status(HTTP_STATUS.CREATED).json(
            successResponse(newUser, "User Created")
        );
    } catch (error) {
        next(error);
    }
};

/**
 * @description Retrieve user details by ID.
 * @route GET /user/:id
 * @returns {Promise<void>}
 */
export const getUserById = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;

        const user: User = await userService.getUserById(id);

        res.status(HTTP_STATUS.OK).json(
            successResponse(
                user,
                `User with ID "${id}" retrieved successfully`
            )
        );
    } catch (error) {
        next(error);
    }
};

/**
 * @description Update user information.
 * @route PUT /user/:id
 * @returns {Promise<void>}
 */
export const updateUser = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const updatedUser: User = await userService.updateUser(req.params.id, req.body);

        res.status(HTTP_STATUS.OK).json(
            successResponse(updatedUser, "User Updated")
        );
    } catch (error) {
        next(error);
    }
};

/**
 * @description Delete a user.
 * @route DELETE /user/:id
 * @returns {Promise<void>}
 */
export const deleteUser = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        await userService.deleteUser(req.params.id);

        res.status(HTTP_STATUS.OK).json(successResponse("User Deleted"));
    } catch (error) {
        next(error);
    }
};
