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
import { validateRequest } from "../middleware/validate";

const router: Router = express.Router();

/**
 * @route POST /setCustomClaims
 * @description Set custom claims for a user.
 * @note Only accessible to administrators.
 *
 * @openapi
 * /api/v1/admin/setCustomClaims:
 *   post:
 *     summary: Set custom user claims
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               uid:
 *                 type: string
 *                 description: UID of the user to set claims for
 *               claims:
 *                 type: object
 *                 additionalProperties:
 *                   type: string
 *                 description: Custom claims to assign to the user
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Custom claims successfully set for the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Custom claims set for user: {uid}
 *       401:
 *         description: Unauthorized - User not authenticated
 *       403:
 *         description: Forbidden - User not authorized
 *       500:
 *         description: Internal server error
 */
router.post(
    "/setCustomClaims",
    authenticate,
    isAuthorized({ hasRole: ["admin"] }),
    setCustomClaims
);

export default router;
