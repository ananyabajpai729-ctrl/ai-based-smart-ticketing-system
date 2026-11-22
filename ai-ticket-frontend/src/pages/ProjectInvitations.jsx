
import { useEffect, useState } from "react";

export default function ProjectInvitations() {
    const [invitations, setInvitations] = useState([]);
    const [loading, setLoading] = useState(true);

    const BASE_URL = import.meta.env.VITE_SERVER_URL;
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchInvitations = async () => {
            try {
                const res = await fetch(
                    `${BASE_URL}/project-invitations/received`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const data = await res.json();

                if (res.ok) {
                    setInvitations(data);
                } else {
                    console.error(data.message);
                }

            } catch (error) {
                console.error("Error fetching invitations:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchInvitations();
    }, []);

    const updateInvitation = async (invitationId, status) => {
        try {
            const res = await fetch(
                `${BASE_URL}/project-invitations/${invitationId}`,
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
                setInvitations(prev =>
                    prev.map(invitation =>
                        invitation._id === invitationId
                            ? { ...invitation, status }
                            : invitation
                    )
                );

                alert(`Invitation ${status} successfully!`);
            } else {
                alert(data.message);
            }

        } catch (error) {
            console.error("Error updating invitation:", error);
            alert("Something went wrong.");
        }
    };

    if (loading) {
        return <p className="text-center mt-10">Loading invitations...</p>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">

            <h2 className="text-3xl font-bold">
                Project Invitations
            </h2>

            {invitations.length === 0 ? (
                <p className="text-center py-12 text-gray-500">
                    You don't have any project invitations yet.
                </p>
            ) : (
                <div className="space-y-5">
                    {invitations.map(invitation => (
                        <div
                            key={invitation._id}
                            className="card bg-base-200 shadow-md"
                        >
                            <div className="card-body">

                                <h3 className="card-title">
                                    {invitation.project?.title || "Project"}
                                </h3>

                                <p className="text-sm text-gray-500">
                                    Invited by: {invitation.sender?.name || "Unknown"}
                                </p>

                                <p>
                                    {invitation.project?.description}
                                </p>

                                <div className="bg-base-100 p-4 rounded-lg">
                                    <p className="font-semibold mb-1">
                                        Invitation Message
                                    </p>
                                    <p>{invitation.message}</p>
                                </div>

                                <div className="card-actions justify-between items-center">
                                    <span className="badge badge-outline">
                                        {invitation.status}
                                    </span>

                                    {invitation.status === "pending" && (
                                        <div className="flex gap-2">
                                            <button
                                                className="btn btn-success btn-sm"
                                                onClick={() =>
                                                    updateInvitation(invitation._id, "accepted")
                                                }
                                            >
                                                Accept
                                            </button>

                                            <button
                                                className="btn btn-error btn-sm"
                                                onClick={() =>
                                                    updateInvitation(invitation._id, "rejected")
                                                }
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    )}
                                </div>

                            </div>
                        </div>
                    ))}
                </div>
            )}

        </div>
    );
}
