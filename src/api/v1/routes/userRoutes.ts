import express, { Router } from "express";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";
import {
    createUser,
    getUserById,
    updateUser,
    deleteUser,
} from "../controllers/userController";
import { validateRequest } from "../middleware/validate";
import {
    postUserSchema,
    getUserByIdSchema,
    putUserSchema,
    deleteUserSchema,
} from "../validations/userValidation";

const router: Router = express.Router();

// Create a new user
router.post(
    "/",
    authenticate,
    isAuthorized({ hasRole: ["admin"] }),
    validateRequest(postUserSchema),
    createUser
);

// Retrieve user details by ID
router.get(
    "/:id",
    authenticate,
    isAuthorized({ hasRole: ["admin"], allowSameUser: true }),
    validateRequest(getUserByIdSchema),
    getUserById
);

// Update user information
router.put(
    "/:id",
    authenticate,
    isAuthorized({ hasRole: ["admin"], allowSameUser: true }),
    validateRequest(putUserSchema),
    updateUser
);

// Delete a user
router.delete(
    "/:id",
    authenticate,
    isAuthorized({ hasRole: ["admin"], allowSameUser: true }),
    validateRequest(deleteUserSchema),
    deleteUser
);

export default router;
