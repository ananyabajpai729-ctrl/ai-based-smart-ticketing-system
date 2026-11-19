import express from "express";
import {authenticate} from "../middlewares/auth.middleware.js"
import { getTicket, getTickets, createTicket, resolveTicket } from "../controllers/ticket.controller.js"

const router = express.Router();

router.get("/", authenticate, getTickets)
router.get("/:id", authenticate, getTicket)
router.post("/", authenticate, createTicket)
router.patch("/:id/resolve", authenticate, resolveTicket);
export default router;