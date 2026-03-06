import express from "express";

import {
  ingestError,
  getProjectErrors,
  resolveError
} from "../controllers/errorController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", ingestError);

router.get("/", protect, getProjectErrors);

router.patch("/:id/resolve", protect, resolveError);

export default router;