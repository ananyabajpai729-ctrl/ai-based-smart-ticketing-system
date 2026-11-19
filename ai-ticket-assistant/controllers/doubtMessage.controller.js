
import Ticket from "../models/ticket.models.js";
import DoubtMessage from "../models/doubtMessage.models.js";

// Check whether the current user can access a doubt's discussion
const canAccessDoubt = (ticket, user) => {
    const userId = user._id.toString();

    return (
        user.role === "admin" ||
        ticket.createdBy?.toString() === userId ||
        ticket.assignedTo?.toString() === userId ||
        ticket.mentor?.toString() === userId
    );
};

// Get all messages belonging to a doubt
export const getDoubtMessages = async (req, res) => {
    try {
        const { ticketId } = req.params;

        const ticket = await Ticket.findById(ticketId);

        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: "Doubt not found"
            });
        }

        if (!canAccessDoubt(ticket, req.user)) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to access this discussion"
            });
        }

        const messages = await DoubtMessage.find({ doubt: ticketId })
            .populate("sender", "name")
            .sort({ createdAt: 1 });

        return res.status(200).json({
            success: true,
            messages
        });

    } catch (error) {
        console.error("Error fetching doubt messages:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Send a message in a doubt's discussion
export const sendDoubtMessage = async (req, res) => {
    try {
        const { ticketId } = req.params;
        const { message } = req.body;

        if (!message || !message.trim()) {
            return res.status(400).json({
                success: false,
                message: "Message cannot be empty"
            });
        }

        const ticket = await Ticket.findById(ticketId);

        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: "Doubt not found"
            });
        }

        if (!canAccessDoubt(ticket, req.user)) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to participate in this discussion"
            });
        }

        if (ticket.status === "closed") {
            return res.status(400).json({
                success: false,
                message: "This discussion is closed"
            });
        }

        const newMessage = await DoubtMessage.create({
            doubt: ticketId,
            sender: req.user._id,
            message: message.trim()
        });

        await newMessage.populate("sender", "name");

        return res.status(201).json({
            success: true,
            message: "Message sent successfully",
            data: newMessage
        });

    } catch (error) {
        console.error("Error sending doubt message:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
