import { inngest } from "../inngest/client.js";
import Ticket from "../models/ticket.models.js"
import ConnectionRequest from "../models/connectionRequest.models.js";

export const createTicket = async(req, res)=>{
    try {
        const {title, description} = req.body;
        if(!title || !description){
            return res.status(400).json({error: "title and description are required"})
        }
        const newTicket = await Ticket.create({
            title,
            description,
            createdBy: req.user._id.toString()
        })
        await inngest.send({
            name: "ticket/created",
            data: {
                ticketId:  newTicket._id.toString(),
                title,
                description,
                createdBy: req.user._id.toString()
            }
        });
        return res.status(201).json({message: "ticket created and processing started", ticket: newTicket})
    } catch (error) {
        console.error("Error creating ticket", error.message)
        return res.status(500).json({message: "internal server error"})
    }
}


export const getTickets = async(req, res)=>{
    try {
        const user = req.user
        let tickets = []

        if(user.role === "admin"){
            tickets = await Ticket.find({})
                .populate("assignedTo", ["email", "_id"])
                .sort({createdAt: -1})
        }else if(user.role === "moderator"){
            tickets = await Ticket.find({assignedTo: user._id})
                .populate("assignedTo", ["email", "_id"])
                .sort({createdAt: -1})
        }else{
            tickets = await Ticket.find({createdBy: user._id})
                .select("title description status createdAt createdBy")
                .sort({createdAt: -1})
        }

        return res.status(200).json(tickets)
    } catch (error) {
        console.error("Error fetching tickets", error.message)
        return res.status(500).json({message: "Internal server error"})
    }
}



export const getTicket = async(req, res)=>{
    try {
        const user = req.user
        const id = req.params.id
        let ticket;

        if(user.role === "admin"){
            ticket = await Ticket.findById(id)
                .populate("assignedTo", ["email", "_id"])
        }else if(user.role === "moderator"){
            ticket = await Ticket.findOne({
                _id: id,
                assignedTo: user._id
            }).populate("assignedTo", ["email", "_id"])
        }else{
            ticket = await Ticket.findOne({
                createdBy: user._id,
                _id: id
            }).select("title description status createdAt createdBy")
        }

        if(!ticket){
            return res.status(404).json({message: "ticket not found"})
        }

        return res.status(200).json(ticket)
    } catch (error) {
        console.error("Error fetching ticket", error.message)
        return res.status(500).json({message: "Internal server error"})
    }
}

export const resolveTicket = async (req, res) => {
    try {
        const { id } = req.params;

        // Only the doubt creator can resolve it
        const ticket = await Ticket.findOneAndUpdate(
            {
                _id: id,
                createdBy: req.user._id,
                status: { $ne: "closed" }
            },
            {
                $set: { status: "closed" }
            },
            { new: true }
        );

        if (!ticket) {
            const existingTicket = await Ticket.findById(id);

            if (!existingTicket) {
                return res.status(404).json({
                    success: false,
                    message: "Doubt not found"
                });
            }

            if (existingTicket.createdBy.toString() !== req.user._id.toString()) {
                return res.status(403).json({
                    success: false,
                    message: "Only the doubt creator can resolve it"
                });
            }

            return res.status(400).json({
                success: false,
                message: "This doubt is already resolved"
            });
        }

        // Cancel all remaining pending mentor requests
        await ConnectionRequest.updateMany(
            {
                ticket: ticket._id,
                status: "pending"
            },
            {
                $set: { status: "cancelled" }
            }
        );

        return res.status(200).json({
            success: true,
            message: "Doubt resolved successfully",
            ticket
        });

    } catch (error) {
        console.error("Error resolving ticket:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
