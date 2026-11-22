
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ProjectCandidates() {
    const { projectId } = useParams();

    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [message, setMessage] = useState("");

    const BASE_URL = import.meta.env.VITE_SERVER_URL;
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchCandidates = async () => {
            try {
                const res = await fetch(
                    `${BASE_URL}/projects/${projectId}/candidates`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const data = await res.json();

                if (res.ok) {
                    setCandidates(data);
                } else {
                    alert(data.message);
                }

            } catch (error) {
                console.error("Error fetching candidates:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCandidates();
    }, [projectId]);

    const sendInvitation = async () => {
        if (!message.trim()) {
            alert("Please write a message before sending an invitation.");
            return;
        }

        try {
            const res = await fetch(
                `${BASE_URL}/project-invitations`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        projectId,
                        recipientId: selectedUser._id,
                        message
                    })
                }
            );

            const data = await res.json();

            if (res.ok) {
                alert("Invitation sent successfully!");
                setSelectedUser(null);
                setMessage("");
            } else {
                alert(data.message);
            }

        } catch (error) {
            console.error("Error sending invitation:", error);
            alert("Something went wrong.");
        }
    };

    if (loading) {
        return <p className="text-center mt-10">Loading candidates...</p>;
    }

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-6">

            <h2 className="text-3xl font-bold">
                Find Teammates
            </h2>

            <p className="text-gray-500">
                Discover students whose skills and interests match your project.
            </p>

            {candidates.length === 0 ? (
                <p className="text-center py-10 text-gray-500">
                    No potential teammates found.
                </p>
            ) : (
                <div className="grid md:grid-cols-2 gap-5">
                    {candidates.map(candidate => (
                        <div
                            key={candidate._id}
                            className="card bg-base-200 shadow-md"
                        >
                            <div className="card-body">

                                <h3 className="card-title">
                                    {candidate.name || "Unnamed Student"}
                                </h3>

                                <p>{candidate.bio || "No bio available."}</p>

                                <div>
                                    <strong>Skills:</strong>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {candidate.skills?.map((skill, index) => (
                                            <span
                                                key={index}
                                                className="badge badge-outline"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <strong>Interests:</strong>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {candidate.interests?.map((interest, index) => (
                                            <span
                                                key={index}
                                                className="badge badge-secondary"
                                            >
                                                {interest}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="card-actions justify-end">
                                    <button
                                        className="btn btn-primary btn-sm"
                                        onClick={() => setSelectedUser(candidate)}
                                    >
                                        Invite to Project
                                    </button>
                                </div>

                            </div>
                        </div>
                    ))}
                </div>
            )}

            {selectedUser && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-base-100 rounded-xl p-6 w-full max-w-md space-y-4">

                        <h3 className="text-xl font-bold">
                            Invite {selectedUser.name}
                        </h3>

                        <textarea
                            className="textarea textarea-bordered w-full"
                            placeholder="Write a personal invitation message..."
                            rows="4"
                            maxLength={500}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />

                        <p className="text-xs text-gray-500 text-right">
                            {message.length}/500
                        </p>

                        <div className="flex justify-end gap-3">
                            <button
                                className="btn btn-ghost"
                                onClick={() => {
                                    setSelectedUser(null);
                                    setMessage("");
                                }}
                            >
                                Cancel
                            </button>

                            <button
                                className="btn btn-primary"
                                onClick={sendInvitation}
                            >
                                Send Invitation
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}
