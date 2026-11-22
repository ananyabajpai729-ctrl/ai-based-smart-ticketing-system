
import Project from "../models/project.models.js";
import ProjectInvitation from "../models/projectInvitation.models.js";
import User from "../models/user.models.js";

// Create a project
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

// Get projects I'm a member of
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

// Send a project invitation
export const sendProjectInvitation = async (req, res) => {
    try {
        const { projectId, recipientId, message } = req.body;

        if (!projectId || !recipientId || !message?.trim()) {
            return res.status(400).json({
                message: "Project, recipient and message are required"
            });
        }

        if (message.trim().length > 500) {
            return res.status(400).json({
                message: "Message cannot exceed 500 characters"
            });
        }

        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        // Only the project creator can invite members
        if (project.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "Only the project creator can send invitations"
            });
        }

        if (project.status !== "recruiting") {
            return res.status(400).json({
                message: "This project is no longer accepting members"
            });
        }

        if (recipientId === req.user._id.toString()) {
            return res.status(400).json({
                message: "You cannot invite yourself"
            });
        }

        const recipient = await User.findById(recipientId);

        if (!recipient) {
            return res.status(404).json({
                message: "Recipient not found"
            });
        }

        if (project.members.some(
            member => member.toString() === recipientId
        )) {
            return res.status(400).json({
                message: "This user is already a project member"
            });
        }

        const existingInvitation = await ProjectInvitation.findOne({
            project: projectId,
            recipient: recipientId,
            status: "pending"
        });

        if (existingInvitation) {
            return res.status(409).json({
                message: "An invitation is already pending for this user"
            });
        }

        const invitation = await ProjectInvitation.create({
            project: projectId,
            sender: req.user._id,
            recipient: recipientId,
            message: message.trim()
        });

        return res.status(201).json({
            success: true,
            message: "Project invitation sent successfully",
            invitation
        });

    } catch (error) {
        console.error("Error sending project invitation:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

// Get invitations received
export const getReceivedProjectInvitations = async (req, res) => {
    try {
        const invitations = await ProjectInvitation.find({
            recipient: req.user._id
        })
        .populate("project", "title description status")
        .populate("sender", "name email")
        .sort({ createdAt: -1 });

        return res.status(200).json(invitations);

    } catch (error) {
        console.error("Error fetching received invitations:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

// Get invitations sent
export const getSentProjectInvitations = async (req, res) => {
    try {
        const invitations = await ProjectInvitation.find({
            sender: req.user._id
        })
        .populate("project", "title description status")
        .populate("recipient", "name email")
        .sort({ createdAt: -1 });

        return res.status(200).json(invitations);

    } catch (error) {
        console.error("Error fetching sent invitations:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

// Accept or reject an invitation
export const updateProjectInvitationStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const { invitationId } = req.params;

        if (!["accepted", "rejected"].includes(status)) {
            return res.status(400).json({
                message: "Status must be accepted or rejected"
            });
        }

        const invitation = await ProjectInvitation.findOne({
            _id: invitationId,
            recipient: req.user._id,
            status: "pending"
        });

        if (!invitation) {
            return res.status(404).json({
                message: "Pending invitation not found"
            });
        }

        if (status === "accepted") {
            const project = await Project.findOneAndUpdate(
                {
                    _id: invitation.project,
                    status: "recruiting"
                },
                {
                    $addToSet: { members: req.user._id }
                },
                { new: true }
            );

            if (!project) {
                return res.status(400).json({
                    message: "This project is no longer accepting members"
                });
            }
        }

        invitation.status = status;
        await invitation.save();

        return res.status(200).json({
            success: true,
            message: `Invitation ${status} successfully`,
            invitation
        });

    } catch (error) {
        console.error("Error updating project invitation:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

export const getProjectCandidates = async (req, res) => {
    try {
        const { projectId } = req.params;

        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        // Only the project creator can find candidates
        if (project.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "Only the project creator can view candidates"
            });
        }

        if (project.status !== "recruiting") {
            return res.status(400).json({
                message: "This project is no longer accepting members"
            });
        }

        const candidates = await User.find({
            _id: {
                $nin: [
                    ...project.members,
                    project.createdBy
                ]
            },
            role: { $ne: "admin" }
        }).select("name bio skills interests");

        return res.status(200).json(candidates);

    } catch (error) {
        console.error("Error fetching project candidates:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};


export const getProjectDetails = async (req, res) => {
    try {
        const { projectId } = req.params;

        const project = await Project.findOne({
            _id: projectId,
            members: req.user._id
        })
        .populate("createdBy", "name email")
        .populate("members", "name email bio skills");

        if (!project) {
            return res.status(404).json({
                message: "Project not found or you are not a member"
            });
        }

        return res.status(200).json(project);

    } catch (error) {
        console.error("Error fetching project details:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};


export const updateProjectStatus = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { status } = req.body;

        if (!["recruiting", "in-progress", "completed"].includes(status)) {
            return res.status(400).json({
                message: "Invalid project status"
            });
        }

        const project = await Project.findOne({
            _id: projectId,
            createdBy: req.user._id
        });

        if (!project) {
            return res.status(404).json({
                message: "Project not found or you are not the creator"
            });
        }

        project.status = status;
        await project.save();

        return res.status(200).json({
            success: true,
            message: "Project status updated successfully",
            project
        });

    } catch (error) {
        console.error("Error updating project status:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};
