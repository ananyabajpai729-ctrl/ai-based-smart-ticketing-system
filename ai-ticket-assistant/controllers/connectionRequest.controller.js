
import ConnectionRequest from "../models/connectionRequest.models.js";
import User from "../models/user.models.js";
import Ticket from "../models/ticket.models.js";

export const sendConnectionRequest = async (req, res) => {
    try {
        const { mentorId, ticketId, message = "" } = req.body;
        const senderId = req.user._id;

        if (!mentorId || !ticketId) {
            return res.status(400).json({
                message: "Mentor and doubt are required"
            });
        }

        // A user cannot send a request to themselves
        if (senderId.toString() === mentorId.toString()) {
            return res.status(400).json({
                message: "You cannot send a request to yourself"
            });
        }

        // Check whether the selected user is an eligible mentor
        const mentor = await User.findOne({
            _id: mentorId,
            canMentor: true,
            role: { $ne: "admin" }
        });

        if (!mentor) {
            return res.status(404).json({
                message: "Mentor not found"
            });
        }

        // The doubt must belong to the sender and be available
        const ticket = await Ticket.findOne({
            _id: ticketId,
            createdBy: senderId,
            status: { $ne: "closed" },
            mentor: null
        });

        if (!ticket) {
            return res.status(404).json({
                message: "Doubt not found or no longer available for mentorship"
            });
        }

        // Prevent duplicate pending requests for the same doubt and mentor
        const existingRequest = await ConnectionRequest.findOne({
            sender: senderId,
            mentor: mentorId,
            ticket: ticketId,
            status: "pending"
        });

        if (existingRequest) {
            return res.status(409).json({
                message: "You already have a pending request for this doubt and mentor"
            });
        }

        const request = await ConnectionRequest.create({
            sender: senderId,
            mentor: mentorId,
            ticket: ticketId,
            message
        });

        return res.status(201).json({
            message: "Connection request sent successfully",
            request
        });

    } catch (error) {
        console.error("Error sending connection request:", error.message);

        return res.status(500).json({
            message: "Failed to send connection request"
        });
    }
};


export const getReceivedRequests = async (req, res) => {
    try {
        const requests = await ConnectionRequest.find({
            mentor: req.user._id
        })
            .populate("sender", "name email skills")
            .populate("ticket", "title description status")
            .sort({ createdAt: -1 });

        return res.status(200).json(requests);

    } catch (error) {
        console.error("Error fetching received requests:", error.message);

        return res.status(500).json({
            message: "Failed to fetch received requests"
        });
    }
};


export const updateRequestStatus = async (req, res) => {
    try {
        const { requestId } = req.params;
        const { status } = req.body;

        if (!["accepted", "rejected"].includes(status)) {
            return res.status(400).json({
                message: "Invalid request status"
            });
        }

        // Only the mentor who received this request can process it
        const request = await ConnectionRequest.findOne({
            _id: requestId,
            mentor: req.user._id,
            status: "pending"
        });

        if (!request) {
            return res.status(404).json({
                message: "Pending connection request not found"
            });
        }

        if (status === "rejected") {
            request.status = "rejected";
            await request.save();

            return res.status(200).json({
                message: "Request rejected successfully",
                request
            });
        }

        // Atomically select the first mentor who accepts.
        // Only one request can successfully claim a doubt.
        const ticket = await Ticket.findOneAndUpdate(
            {
                _id: request.ticket,
                createdBy: request.sender,
                status: { $ne: "closed" },
                mentor: null
            },
            {
                $set: {
                    mentor: request.mentor,
                    status: "in-progress"
                }
            },
            { new: true }
        );

        if (!ticket) {
            return res.status(409).json({
                message: "This doubt is closed or another mentor has already been selected"
            });
        }

        // Mark the winning request as accepted
        request.status = "accepted";
        await request.save();

        // Cancel all other pending requests for this doubt
        await ConnectionRequest.updateMany(
            {
                _id: { $ne: request._id },
                ticket: request.ticket,
                status: "pending"
            },
            {
                $set: {
                    status: "cancelled"
                }
            }
        );

        return res.status(200).json({
            message: "Request accepted successfully. Other pending requests have been cancelled.",
            request,
            ticket
        });

    } catch (error) {
        console.error("Error updating request:", error.message);

        return res.status(500).json({
            message: "Failed to update request"
        });
    }
};


export const getSentRequests = async (req, res) => {
    try {
        const requests = await ConnectionRequest.find({
            sender: req.user._id
        })
            .populate("mentor", "name email skills")
            .populate("ticket", "title description status")
            .sort({ createdAt: -1 });

        return res.status(200).json(requests);

    } catch (error) {
        console.error("Error fetching sent requests:", error.message);

        return res.status(500).json({
            message: "Failed to fetch sent requests"
        });
    }
};
