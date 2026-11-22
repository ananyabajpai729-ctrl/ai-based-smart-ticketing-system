
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function MyProjects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    const BASE_URL = import.meta.env.VITE_SERVER_URL;
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "null");

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await fetch(
                    `${BASE_URL}/projects/my-projects`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const data = await res.json();

                if (res.ok) {
                    setProjects(data);
                } else {
                    console.error(data.message);
                }

            } catch (error) {
                console.error("Error fetching projects:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    if (loading) {
        return <p className="text-center mt-10">Loading projects...</p>;
    }

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-6">

            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold">My Projects</h2>

                <Link to="/projects/create" className="btn btn-primary">
                    Create Project
                </Link>
            </div>

            {projects.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500 mb-4">
                        You haven't joined any projects yet.
                    </p>

                    <Link to="/projects/create" className="btn btn-primary">
                        Create Your First Project
                    </Link>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 gap-5">
                    {projects.map(project => {
                        const isCreator =
                            project.createdBy?._id === user?._id;

                        return (
                            <div
                                key={project._id}
                                className="card bg-base-200 shadow-md"
                            >
                                <div className="card-body">

                                    <h3 className="card-title">
                                        {project.title}
                                    </h3>

                                    <p>{project.description}</p>

                                    <div>
                                        <strong>Required Skills:</strong>

                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {project.requiredSkills.map(
                                                (skill, index) => (
                                                    <span
                                                        key={index}
                                                        className="badge badge-outline"
                                                    >
                                                        {skill}
                                                    </span>
                                                )
                                            )}
                                        </div>
                                    </div>

                                    <p className="text-sm text-gray-500">
                                        Created by: {
                                            project.createdBy?.name || "Unknown"
                                        }
                                    </p>

                                    <p className="text-sm">
                                        Team Members: {project.members.length}
                                    </p>

                                    <div className="card-actions justify-between items-center">
                                        <span className="badge badge-primary">
                                            {project.status}
                                        </span>
                                        <Link
                                            to={`/projects/${project._id}`}
                                            className="btn btn-outline btn-sm"
                                        >
                                            View Project
                                        </Link>
                                        {isCreator && project.status === "recruiting" && (
                                            <Link
                                                to={`/projects/${project._id}/candidates`}
                                                className="btn btn-sm btn-primary"
                                            >
                                                Find Teammates
                                            </Link>
                                        )}
                                    </div>

                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
