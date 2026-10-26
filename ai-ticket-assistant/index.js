import dns from 'node:dns';
dns.setServers(['8.8.8.8', '1.1.1.1']); 

import 'dotenv/config'; 
import mongoose from 'mongoose'; 
import express from 'express';
import cors from 'cors';
const PORT = process.env.PORT || 3000;


const app = express();
app.use(cors())

app.use(express.json())

mongoose
.connect(process.env.MONGO_URI)
.then(() =>{
    console.log("MongoDB connected")
    app.listen(PORT, () =>{
        console.log("Server at http://localhost:3000")
    })
})
.catch((err) => console.error("MongoDB error: ", err))