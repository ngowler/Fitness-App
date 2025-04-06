import { Request, Response, NextFunction } from "express";
import { RepositoryError, ServiceError, ValidationError } from "../errors/errors";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import { errorResponse } from "../models/responseModel";

/**
 * Global error handling middleware for an Express application.
 * Catches all errors passed to next() and formats them into a consistent response format.
 *
 * @param err - The error object passed from previous middleware or route handlers
 * @param req - Express request object
 * @param res - Express response object
 * @param _next - Express next function (unused but required for Express error middleware signature)
 *
 * Features:
 * - Handles RepositoryError and ServiceError with their specific status codes and messages
 * - Provides consistent error response format
 * - Logs errors for debugging
 */
const errorHandler = (
    err: Error | null,
    req: Request,
    res: Response,
    _next: NextFunction
): void => {
    if (!err) {
        console.error("Error: null or undefined error received");
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
            errorResponse("An unexpected error occurred", "UNKNOWN_ERROR")
        );
        return;
    }

    console.error(`Error: ${err.message}`);

    if (err instanceof RepositoryError || err instanceof ServiceError || err instanceof ValidationError) {
        res.status(err.statusCode).json(errorResponse(err.message, err.code));
    } else {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
            errorResponse("An unexpected error occurred", "UNKNOWN_ERROR")
        );
    }
};

export default errorHandler;
