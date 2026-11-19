import express from "express";
import {getUsers, login, signup, updateUser, logout, getProfile, updateProfile, getMentors} from "../controllers/user.controller.js"
import {authenticate} from "../middlewares/auth.middleware.js"


const router = express.Router()

router.post("/update-user", authenticate, updateUser)
router.get("/users", authenticate, getUsers)

router.post("/signup", signup)
router.post("/login", login)
router.post("/logout", logout)
router.get("/profile", authenticate, getProfile);
router.put("/profile", authenticate, updateProfile);
router.get("/mentors", authenticate, getMentors);

export default router