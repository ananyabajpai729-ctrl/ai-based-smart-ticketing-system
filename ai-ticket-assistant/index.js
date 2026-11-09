import dns from 'node:dns';
dns.setServers(['8.8.8.8', '1.1.1.1']); 

import 'dotenv/config'; 
import mongoose from 'mongoose'; 
import express from 'express';
import cors from 'cors';
import userRoutes from "./routes/user.routes.js"
import ticketRoutes from "./routes/ticket.routes.js"
import {serve} from "inngest/express"
import {inngest} from "./inngest/client.js"
import {onUserSignup} from "./inngest/functions/onsignup.js"
import {onTicketCreated} from "./inngest/functions/onticketcreate.js"

import dotenv from "dotenv";
dotenv.config()
const PORT = process.env.PORT || 3000;


const app = express();
app.use(cors())

app.use(express.json())

app.use("/api/auth", userRoutes)
app.use("/api/tickets", ticketRoutes)
app.use("/api/inngest", serve({
    client: inngest,
    functions: [onUserSignup, onTicketCreated]
}))

mongoose
.connect(process.env.MONGO_URI)
.then(() =>{
    console.log("MongoDB connected")
    app.listen(PORT, () =>{
        console.log("Server at http://localhost:3000")
    })
})
.catch((err) => console.error("MongoDB error: ", err))