
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateProject() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        requiredSkills: ""
    });

    const [loading, setLoading] = useState(false);

    const BASE_URL = import.meta.env.VITE_SERVER_URL;
    const token = localStorage.getItem("token");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch(`${BASE_URL}/projects`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: formData.title,
                    description: formData.description,
                    requiredSkills: formData.requiredSkills
                        .split(",")
                        .map(skill => skill.trim())
                        .filter(Boolean)
                })
            });

            const data = await res.json();

            if (res.ok) {
                alert("Project created successfully!");
                navigate("/my-projects");
            } else {
                alert(data.message || "Failed to create project");
            }

        } catch (error) {
            console.error(error);
            alert("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h2 className="text-3xl font-bold mb-6">Create a Project</h2>

            <form onSubmit={handleSubmit} className="space-y-5">

                <div>
                    <label className="label font-semibold">Project Title</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="e.g. AI Study Planner"
                        className="input input-bordered w-full"
                        required
                    />
                </div>

                <div>
                    <label className="label font-semibold">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Describe your project idea..."
                        className="textarea textarea-bordered w-full"
                        rows="5"
                        required
                    />
                </div>

                <div>
                    <label className="label font-semibold">
                        Required Skills
                    </label>
                    <input
                        type="text"
                        name="requiredSkills"
                        value={formData.requiredSkills}
                        onChange={handleChange}
                        placeholder="React, Node.js, MongoDB"
                        className="input input-bordered w-full"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                        Separate skills using commas.
                    </p>
                </div>

                <button
                    type="submit"
                    className="btn btn-primary w-full"
                    disabled={loading}
                >
                    {loading ? "Creating..." : "Create Project"}
                </button>

            </form>
        </div>
    );
}
