import { Request, Response, NextFunction } from "express";
import { AuthorizationOptions } from "../models/authorizationOptions";
import { MiddlewareFunction } from "../types/expressTypes";
import { AuthorizationError } from "../errors/errors";

/**
 * Creates a middleware function that authorizes requests based on user roles
 * or resource ownership.
 *
 * @param opts - Authorization options configuration
 * @param opts.allowSameUser - When true, allows users to access their own resources
 * @param opts.hasRole - Array of roles that are permitted to access the resource
 * @returns Middleware function that performs the authorization check
 */
const isAuthorized = (opts: AuthorizationOptions): MiddlewareFunction => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { role, uid } = res.locals;
        const userId: string = req.params.uid;

        if (opts.allowSameUser && userId && uid === userId) {
            return next();
        }

        if (!role) {
            return next(
                new AuthorizationError(
                    "Forbidden: No role found",
                    "ROLE_NOT_FOUND"
                )
            );
        }

        if (opts.hasRole.includes(role)) {
            return next();
        }

        return next(
            new AuthorizationError(
                "Forbidden: Insufficient role",
                "INSUFFICIENT_ROLE"
            )
        );
    };
};

export default isAuthorized;
