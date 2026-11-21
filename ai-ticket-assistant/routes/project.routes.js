
import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";

import {
    createProject,
    getMyProjects
} from "../controllers/project.controller.js";

const router = express.Router();

router.post("/", authenticate, createProject);
router.get("/my-projects", authenticate, getMyProjects);

export default router;
