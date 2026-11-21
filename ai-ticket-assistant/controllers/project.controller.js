
import Project from "../models/project.models.js";

export const createProject = async (req, res) => {
    try {
        const { title, description, requiredSkills = [] } = req.body;

        if (!title?.trim() || !description?.trim()) {
            return res.status(400).json({
                message: "Title and description are required"
            });
        }

        if (!Array.isArray(requiredSkills)) {
            return res.status(400).json({
                message: "Required skills must be an array"
            });
        }

        const project = await Project.create({
            title,
            description,
            requiredSkills,
            createdBy: req.user._id,
            members: [req.user._id]
        });

        return res.status(201).json({
            success: true,
            message: "Project created successfully",
            project
        });

    } catch (error) {
        console.error("Error creating project:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

export const getMyProjects = async (req, res) => {
    try {
        const projects = await Project.find({
            members: req.user._id
        })
        .populate("createdBy", ["name", "email", "_id"])
        .populate("members", ["name", "email", "_id"])
        .sort({ createdAt: -1 });

        return res.status(200).json(projects);

    } catch (error) {
        console.error("Error fetching projects:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};
