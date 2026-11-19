
import { useEffect, useState } from "react";

export default function ReceivedRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const fetchRequests = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/requests/received`,
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

  useEffect(() => {
    fetchRequests();
  }, []);

  const updateStatus = async (requestId, status) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/requests/${requestId}`,
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

      if (!res.ok) {
        throw new Error(data.message || "Failed to update request");
      }

      // Refresh the list after accepting or rejecting
      await fetchRequests();

    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Loading requests...</p>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">
        Received Requests
      </h1>

      <p className="opacity-60 mb-6">
        Review mentorship requests sent to you.
      </p>

      {error && <p className="text-error mb-4">{error}</p>}

      {requests.length === 0 ? (
        <p className="text-center mt-10 opacity-60">
          You haven't received any requests yet.
        </p>
      ) : (
        <div className="space-y-5">
          {requests.map(request => (
            <div
              key={request._id}
              className="card bg-base-200 shadow-md"
            >
              <div className="card-body">
                <h2 className="card-title">
                  {request.sender?.name || "Unknown Student"}
                </h2>

                <p className="text-sm opacity-70">
                  {request.sender?.email}
                </p>

                <div className="mt-3">
                  <h3 className="font-semibold">Related Doubt</h3>
                  <p>{request.ticket?.title}</p>
                  <p className="text-sm opacity-70">
                    {request.ticket?.description}
                  </p>
                </div>

                <div className="mt-3">
                  <h3 className="font-semibold">Message</h3>
                  <p>
                    {request.message || "No message provided."}
                  </p>
                </div>

                <div className="mt-3">
                  <span className="badge badge-outline">
                    {request.status}
                  </span>
                </div>

                {request.status === "pending" && (
                  <div className="card-actions justify-end mt-4">
                    <button
                      className="btn btn-error btn-outline"
                      onClick={() =>
                        updateStatus(request._id, "rejected")
                      }
                    >
                      Reject
                    </button>

                    <button
                      className="btn btn-success"
                      onClick={() =>
                        updateStatus(request._id, "accepted")
                      }
                    >
                      Accept
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
