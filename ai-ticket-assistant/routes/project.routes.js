
import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";

import {
    createProject,
    getMyProjects,
    getProjectCandidates,
    getProjectDetails,
    updateProjectStatus
} from "../controllers/project.controller.js";

const router = express.Router();

router.post("/", authenticate, createProject);
router.get("/my-projects", authenticate, getMyProjects);
router.get("/:projectId/candidates", authenticate, getProjectCandidates);
router.get("/:projectId", authenticate, getProjectDetails);
router.patch("/:projectId/status", authenticate, updateProjectStatus);

export default router;
