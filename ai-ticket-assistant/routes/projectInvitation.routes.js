
import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";

import {
    sendProjectInvitation,
    getReceivedProjectInvitations,
    getSentProjectInvitations,
    updateProjectInvitationStatus
} from "../controllers/project.controller.js";

const router = express.Router();

router.post("/", authenticate, sendProjectInvitation);

router.get("/received", authenticate, getReceivedProjectInvitations);

router.get("/sent", authenticate, getSentProjectInvitations);

router.patch("/:invitationId", authenticate, updateProjectInvitationStatus);

export default router;
