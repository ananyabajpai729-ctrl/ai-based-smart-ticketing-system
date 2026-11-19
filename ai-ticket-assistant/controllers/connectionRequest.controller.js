
import ConnectionRequest from "../models/connectionRequest.models.js";
import User from "../models/user.models.js";
import Ticket from "../models/ticket.models.js";

export const sendConnectionRequest = async (req, res) => {
    try {
        const { mentorId, ticketId, message = "" } = req.body;
        const senderId = req.user._id;

        // Check whether all required fields are provided
        if (!mentorId || !ticketId) {
            return res.status(400).json({
                message: "Mentor and doubt are required"
            });
        }

        // A user cannot send a request to themselves
        if (senderId === mentorId) {
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

        // Check whether the doubt belongs to the logged-in student
        const ticket = await Ticket.findOne({
            _id: ticketId,
            createdBy: senderId
        });

        if (!ticket) {
            return res.status(404).json({
                message: "Doubt not found"
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

        const request = await ConnectionRequest.findOne({
            _id: requestId,
            mentor: req.user._id
        });

        if (!request) {
            return res.status(404).json({
                message: "Connection request not found"
            });
        }

        if (request.status !== "pending") {
            return res.status(400).json({
                message: "This request has already been processed"
            });
        }

        // If accepted, assign the doubt to this mentor
        if (status === "accepted") {

            const ticket = await Ticket.findOneAndUpdate(
                {
                    _id: request.ticket,
                    createdBy: request.sender,
                    status: { $ne: "closed" }
                },
                {
                    $set: {
                        assignedTo: request.mentor,
                        status: "in-progress"
                    }
                },
                { new: true }
            );

            if (!ticket) {
                return res.status(400).json({
                    message: "The associated doubt was not found or is already closed"
                });
            }
        }

        request.status = status;
        await request.save();

        return res.status(200).json({
            message: `Request ${status} successfully`,
            request
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

