import express, { Router } from "express";

const router: Router = express.Router();

// Create a new user
router.post("/");
// Retrieve user details by ID
router.get("/:id");
// Update user information
router.put("/:id");
// Delete a user
router.delete("/:id");
// Upgrade a user's role (admin)
router.post("/:id/upgrade");

export default router;
