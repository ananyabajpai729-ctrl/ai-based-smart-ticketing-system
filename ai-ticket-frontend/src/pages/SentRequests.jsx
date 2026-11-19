
import { useEffect, useState } from "react";

export default function SentRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/requests/sent`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch requests");
        }

        setRequests(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [token]);

  if (loading) {
    return <p className="text-center mt-10">Loading requests...</p>;
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "accepted":
        return "badge-success";
      case "rejected":
        return "badge-error";
      default:
        return "badge-warning";
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">
        My Requests
      </h1>

      <p className="opacity-60 mb-6">
        Track the mentorship requests you've sent.
      </p>

      {error && <p className="text-error mb-4">{error}</p>}

      {requests.length === 0 ? (
        <p className="text-center mt-10 opacity-60">
          You haven't sent any requests yet.
        </p>
      ) : (
        <div className="space-y-5">
          {requests.map(request => (
            <div
              key={request._id}
              className="card bg-base-200 shadow-md"
            >
              <div className="card-body">
                <div className="flex justify-between items-start gap-3">
                  <h2 className="card-title">
                    {request.mentor?.name || "Unknown Mentor"}
                  </h2>

                  <span className={`badge ${getStatusBadge(request.status)}`}>
                    {request.status}
                  </span>
                </div>

                <p className="text-sm opacity-70">
                  {request.mentor?.email}
                </p>

                <div className="flex flex-wrap gap-2 mt-2">
                  {request.mentor?.skills?.map(skill => (
                    <span key={skill} className="badge badge-primary">
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="mt-3">
                  <h3 className="font-semibold">Related Doubt</h3>
                  <p>{request.ticket?.title}</p>
                  <p className="text-sm opacity-70">
                    {request.ticket?.description}
                  </p>
                </div>

                <div className="mt-3">
                  <h3 className="font-semibold">Your Message</h3>
                  <p>
                    {request.message || "No message provided."}
                  </p>
                </div>

                <p className="text-xs opacity-50 mt-3">
                  Sent on: {new Date(request.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
