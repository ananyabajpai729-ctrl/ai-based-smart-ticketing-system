
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ProjectDetails() {
    const { projectId } = useParams();

    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    const BASE_URL = import.meta.env.VITE_SERVER_URL;
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "null");

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const res = await fetch(
                    `${BASE_URL}/projects/${projectId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const data = await res.json();

                if (res.ok) {
                    setProject(data);
                } else {
                    alert(data.message);
                }

            } catch (error) {
                console.error("Error fetching project:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [projectId]);

    const updateStatus = async (status) => {
        setUpdating(true);

        try {
            const res = await fetch(
                `${BASE_URL}/projects/${projectId}/status`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({ status })
                }
            );

            const data = await res.json();

            if (res.ok) {
                setProject(prev => ({
                    ...prev,
                    status: data.project.status
                }));
                alert("Project status updated!");
            } else {
                alert(data.message);
            }

        } catch (error) {
            console.error("Error updating status:", error);
            alert("Something went wrong.");
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return <p className="text-center mt-10">Loading project...</p>;
    }

    if (!project) {
        return <p className="text-center mt-10">Project not found.</p>;
    }

    const isCreator = project.createdBy?._id === user?._id;

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-8">

            {/* Project Information */}
            <div className="card bg-base-200 shadow-md">
                <div className="card-body space-y-4">

                    <div className="flex justify-between items-start">
                        <h2 className="text-3xl font-bold">
                            {project.title}
                        </h2>

                        <span className="badge badge-primary">
                            {project.status}
                        </span>
                    </div>

                    <p>{project.description}</p>

                    <div>
                        <strong>Required Skills:</strong>

                        <div className="flex flex-wrap gap-2 mt-2">
                            {project.requiredSkills.map((skill, index) => (
                                <span key={index} className="badge badge-outline">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>

                    <p className="text-sm text-gray-500">
                        Created by: {project.createdBy?.name}
                    </p>

                    {isCreator && (
                        <div className="flex flex-wrap gap-3 pt-3">
                            <button
                                className="btn btn-primary btn-sm"
                                disabled={updating || project.status === "in-progress"}
                                onClick={() => updateStatus("in-progress")}
                            >
                                Start Project
                            </button>

                            <button
                                className="btn btn-success btn-sm"
                                disabled={updating || project.status === "completed"}
                                onClick={() => updateStatus("completed")}
                            >
                                Mark Completed
                            </button>

                            <button
                                className="btn btn-outline btn-sm"
                                disabled={updating || project.status === "recruiting"}
                                onClick={() => updateStatus("recruiting")}
                            >
                                Reopen Recruitment
                            </button>
                        </div>
                    )}

                </div>
            </div>

            {/* Team Members */}
            <div className="space-y-4">

                <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-bold">
                        Team Members ({project.members.length})
                    </h3>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                    {project.members.map(member => (
                        <div
                            key={member._id}
                            className="card bg-base-200 shadow-md"
                        >
                            <div className="card-body">

                                <h4 className="card-title">
                                    {member.name || "Unnamed Student"}
                                </h4>

                                {member._id === project.createdBy?._id && (
                                    <span className="badge badge-primary">
                                        Project Creator
                                    </span>
                                )}

                                <p className="text-sm text-gray-500">
                                    {member.email}
                                </p>

                                <p>{member.bio || "No bio available."}</p>

                                <div className="flex flex-wrap gap-2">
                                    {member.skills?.map((skill, index) => (
                                        <span
                                            key={index}
                                            className="badge badge-outline"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>

                            </div>
                        </div>
                    ))}
                </div>

            </div>

        </div>
    );
}
