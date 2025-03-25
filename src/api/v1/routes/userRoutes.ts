import express, { Router } from "express";

const router: Router = express.Router();

router.post("/");
router.get("/");
router.get("/:id");
router.put("/:id");
router.delete("/:id");
router.post("/:id/upgrade");

export default router;
