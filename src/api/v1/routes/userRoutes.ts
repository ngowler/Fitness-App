import express, { Router } from "express";
import {
    createUser,
    getUserById,
    updateUser,
    deleteUser,
    setCustomClaims,
    } from "../controllers/userController"
import { validateRequest } from "../middleware/validate";
import {
    postUserSchema,
    getUserByIdSchema,
    putUserSchema,
    deleteUserSchema,
    upgradeUserRoleSchema,
} from "../validations/userValidation";

const router: Router = express.Router();

// Create a new user
router.post("/", validateRequest(postUserSchema), createUser);
// Retrieve user details by ID
router.get("/:id", validateRequest(getUserByIdSchema), getUserById);
// Update user information
router.put("/:id", validateRequest(putUserSchema), updateUser);
// Delete a user
router.delete("/:id", validateRequest(deleteUserSchema), deleteUser);
// Upgrade a user's role (admin)
router.post("/:id/upgrade", validateRequest(upgradeUserRoleSchema), setCustomClaims);

export default router;
