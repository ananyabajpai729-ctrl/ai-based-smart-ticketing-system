import { inngest } from "../inngest/client";
import Ticket from "../models/ticket.models.js"

export const createTicket = async(req, res)=>{
    try {
        const {title, description} = req.body;
        if(!title || !description){
            return res.status(400).json({error: "title and description are required"})
        }
        const newTicket = Ticket.create({
            title,
            description,
            createdBy: req.user._id.toString()
        })
        await inngest.send({
            name: "ticket/created",
            data: {
                
            }
        })
    } catch (error) {
        
    }
}