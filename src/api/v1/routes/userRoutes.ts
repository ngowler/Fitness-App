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

/**
 * @route POST /user
 * @description Create a new user.
 * 
 * @openapi
 * /user:
 *   post:
 *     summary: Create a new user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid input provided
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Server error
 */
router.post(
    "/",
    authenticate,
    isAuthorized({ hasRole: ["admin"] }),
    validateRequest(postUserSchema),
    createUser
);

/**
 * @route GET /user/{id}
 * @description Retrieve user details by ID.
 * 
 * @openapi
 * /user/{id}:
 *   get:
 *     summary: Get user details
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to retrieve
 *     responses:
 *       200:
 *         description: User details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Server error
 */
router.get(
    "/:id",
    authenticate,
    isAuthorized({ hasRole: ["admin"], allowSameUser: true }),
    validateRequest(getUserByIdSchema),
    getUserById
);

/**
 * @route PUT /user/{id}
 * @description Update user information.
 * 
 * @openapi
 * /user/{id}:
 *   put:
 *     summary: Update user information
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid input provided
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Server error
 */
router.put(
    "/:id",
    authenticate,
    isAuthorized({ hasRole: ["admin"], allowSameUser: true }),
    validateRequest(putUserSchema),
    updateUser
);

/**
 * @route DELETE /user/{id}
 * @description Delete a user.
 * 
 * @openapi
 * /user/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to delete
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Server error
 */
router.delete(
    "/:id",
    authenticate,
    isAuthorized({ hasRole: ["admin"], allowSameUser: true }),
    validateRequest(deleteUserSchema),
    deleteUser
);

export default router;
