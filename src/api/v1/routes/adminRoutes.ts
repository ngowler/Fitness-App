/**
 * Admin Routes (adminRoutes.ts)
 *
 * This file defines the routes for managing admins in our application.
 * It uses the Express framework for routing and makes calls to the admin controller
 * (adminController.ts) to handle the logic for each route.
 */
import express, { Router } from "express";
import { setCustomClaims } from "../controllers/adminController";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";

const router: Router = express.Router();

/**
 * @route POST /setCustomClaims
 * @description Set custom claims for authenticated users.
 * 
 * @openapi
 * /setCustomClaims:
 *   post:
 *     summary: Set custom claims for a user
 *     tags: [Claims]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               claims:
 *                 type: object
 *                 description: An object containing custom claims to set for the user.
 *                 example: { "role": "admin", "permissions": ["read", "write"] }
 *     responses:
 *       200:
 *         description: Custom claims set successfully
 *       400:
 *         description: Invalid request payload
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Server error
 */
router.post(
    "/setCustomClaims",
    authenticate,
    isAuthorized({ hasRole: ["admin"] }),
    setCustomClaims
);

export default router;
