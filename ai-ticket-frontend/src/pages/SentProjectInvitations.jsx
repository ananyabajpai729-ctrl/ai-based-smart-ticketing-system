
import { useEffect, useState } from "react";

export default function SentProjectInvitations() {
    const [invitations, setInvitations] = useState([]);
    const [loading, setLoading] = useState(true);

    const BASE_URL = import.meta.env.VITE_SERVER_URL;
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchInvitations = async () => {
            try {
                const res = await fetch(
                    `${BASE_URL}/project-invitations/sent`,
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
                console.error("Error fetching sent invitations:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchInvitations();
    }, []);

    if (loading) {
        return <p className="text-center mt-10">Loading sent invitations...</p>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">

            <h2 className="text-3xl font-bold">
                Sent Project Invitations
            </h2>

            {invitations.length === 0 ? (
                <p className="text-center py-12 text-gray-500">
                    You haven't sent any project invitations yet.
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
                                    Invited: {invitation.recipient?.name || "Unknown"}
                                </p>

                                <div className="bg-base-100 p-4 rounded-lg">
                                    <p className="font-semibold mb-1">
                                        Your Message
                                    </p>
                                    <p>{invitation.message}</p>
                                </div>

                                <div className="card-actions justify-between items-center">
                                    <span className="badge badge-outline">
                                        {invitation.status}
                                    </span>

                                    <span className="text-xs text-gray-500">
                                        {new Date(invitation.createdAt).toLocaleDateString()}
                                    </span>
                                </div>

                            </div>
                        </div>
                    ))}
                </div>
            )}

        </div>
    );
}
