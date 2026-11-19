import express from "express";
import {
    getDoubtMessages,
    sendDoubtMessage
} from "../controllers/doubtMessage.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/:ticketId", authenticate, getDoubtMessages);
router.post("/:ticketId", authenticate, sendDoubtMessage);

export default router;
