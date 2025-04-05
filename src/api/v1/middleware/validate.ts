import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "joi";

import { MiddlewareFunction, RequestData } from "../types/expressTypes";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import { ValidationError } from "../errors/errors";

/**
 * Validates data against a Joi schema and throws an error if validation fails.
 *
 * @template T - The type of data being validated
 * @param schema - Joi schema to validate against
 * @param data - Data to validate
 * @throws ValidationError if validation fails, with concatenated error messages
 */
export const validate = <T>(schema: ObjectSchema<T>, data: T): void => {
    const { error } = schema.validate(data, { abortEarly: false });

    if (error) {
        throw new ValidationError(
            `Validation error: ${error.details
                .map((x) => x.message)
                .join(", ")}`,
            "VALIDATION_ERR",
            HTTP_STATUS.BAD_REQUEST
        );
    }
};

/**
 * Creates an Express middleware function that validates request data against a Joi schema.
 * Combines and validates data from request body, URL parameters, and query parameters.
 *
 * @param schema - Joi schema to validate the combined request data against
 * @returns Express middleware function that performs the validation
 * @throws Returns 400 Bad Request if validation fails
 */
export const validateRequest = (schema: ObjectSchema): MiddlewareFunction => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const data: RequestData = {
                ...req.body,
                ...req.params,
                ...req.query,
            };

            validate(schema, data);

            next();
        } catch (error) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                error: (error as ValidationError).message,
            });
        }
    };
};
