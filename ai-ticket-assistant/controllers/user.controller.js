import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import User from "../models/user.models.js"
import {inngest} from "../inngest/client.js"

export const signup = async (req, res)=>{
    const{email, password, skills = []} = req.body;
    try {
        const hashed = await bcrypt.hash(password, 10)
        const user = await User.create({email, password: hashed, skills})

        // fire inngest events
        await inngest.send({
            name: "user/signup",
            data:{
                email
            }
        });

        const token =  jwt.sign(
            {_id : user._id, role: user.role}, process.env.JWT_SECRET
        );

        res.json({ token, user: {
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                        skills: user.skills,
                        canMentor: user.canMentor
                    }})
    } catch (error) {
        res.status(500).json({error: "Signup failed", details: error.message})
    }
}

export const login = async (req, res) =>{
    const{email, password} = req.body;

    try {
        const user = await User.findOne({email})
        if(!user){
            return res.status(401).json({error: "User not found"})
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch){
            return res.status(401).json({error: "Invalid Credentials"})
        }

        const token =  jwt.sign(
            {_id : user._id, role: user.role}, process.env.JWT_SECRET
        );

        res.json({ token, user: {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    skills: user.skills,
    canMentor: user.canMentor
}})
    } catch (error) {
        res.status(500).json({error: "Login failed", details: error.message})   
    }
}

export const logout = async(req, res) =>{
    try{
        const token = req.headers.authorization?.split(" ")[1]
        if(!token) 
            return res.status(401).json({error: "Unauthorized"})
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) =>{
            if(err) 
                return res.status(401).json({error: "Unathorized"})
            return res.json({message: "logout successfully"})
        })
    }catch{
        res.status(500).json({error: "Logout failed", details: error.message}) 
    }
}


export const updateUser = async (req, res) => {
    const { skills = [], email, role } = req.body;

    try {
        if (req.user?.role !== "admin") {
            return res.status(403).json({ error: "Forbidden" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                error: "User not found"
            });
        }

        await User.updateOne(
            { email },
            {
                $set: {
                    skills,
                    role
                }
            },
            { runValidators: true }
        );

        return res.status(200).json({
            message: "User updated successfully"
        });

    } catch (error) {
        console.error("Error updating user:", error);

        return res.status(500).json({
            error: "Update failed"
        });
    }
};


export const getUsers = async(req, res)=>{
    try {
        if(req.user.role !== "admin"){
            return res.status(403).json({error: "Forbidden"})
        }

        const users = await User.find().select("-password")
        return res.json(users)
    } catch (error) {
        return res.status(500).json({error: "Update failed", details: error.message})
    }
}


export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json(user);

    } catch (error) {
        console.error("Error fetching profile:", error.message);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};
export const updateProfile = async (req, res) => {
    try {
        const allowedFields = [
            "name",
            "bio",
            "skills",
            "interests",
            "canMentor",
            "lookingForTeam"
        ];

        const updates = {};

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { $set: updates },
            { new: true, runValidators: true }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            message: "Profile updated successfully",
            user: updatedUser
        });

    } catch (error) {
        console.error("Error updating profile:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getMentors = async (req, res) => {
    try {
        const mentors = await User.find({
            canMentor: true,
            role: { $ne: "admin" }
        })
        .select("_id name bio skills interests")
        .sort({ name: 1 });

        return res.status(200).json(mentors);

    } catch (error) {
        console.error("Error fetching mentors:", error.message);

        return res.status(500).json({
            message: "Failed to fetch mentors"
        });
    }
};


