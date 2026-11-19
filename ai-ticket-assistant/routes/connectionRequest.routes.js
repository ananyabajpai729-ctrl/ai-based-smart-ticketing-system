
import express from "express";
import { sendConnectionRequest, getReceivedRequests, updateRequestStatus, getSentRequests } from "../controllers/connectionRequest.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", authenticate, sendConnectionRequest);
router.get("/received", authenticate, getReceivedRequests);
router.patch("/:requestId", authenticate, updateRequestStatus);
router.get("/sent", authenticate, getSentRequests);

export default router;
