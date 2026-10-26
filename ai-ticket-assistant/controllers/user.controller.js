import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import User from "../models/user.models.js"
import {inngest} from "../inngest/client.js"

export const signup = async (req, res)=>{
    const{email, password, skills = []} = req.body;
    try {
        const hashed = bcrypt.hash(password, 10)
        const user = await User.create({email, password: hashed, skills})

        // fire inngest events
        await inngest.send({
            name: "user/signup",
            data:{
                email
            }
        });

        const token =  jwt.sign(
            {_id : user._id, role: user.role}, process.env.JWTSECRET
        );

        res.json({token})
    } catch (error) {
        res.status(500).json({error: "Signup faile", details: error.message})
    }
}

export const login = async (req, res) =>{
    const{email, password} = req.body;

    try {
        const user = User.findOne({email})
        if(!user){
            return res.status(401).json({error: "User not found"})
        }

        const isMatch = await bcrypt.compare(paswword, user.password)

        if(!isMatch){
            return res.status(401).json({error: "Invalid Credentials"})
        }

        const token =  jwt.sign(
            {_id : user._id, role: user.role}, process.env.JWTSECRET
        );

        res.json({token})
    } catch (error) {
        res.status(500).json({error: "Login failed", details: error.message})   
    }
}