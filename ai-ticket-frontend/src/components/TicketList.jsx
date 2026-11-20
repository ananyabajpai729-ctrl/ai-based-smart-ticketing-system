
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function TicketList({ title, endpoint, showPeople = false }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_SERVER_URL}${endpoint}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch doubts");
        }

        setTickets(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching doubts:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [endpoint, token]);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>

      {loading && <p>Loading doubts...</p>}

      {error && (
        <p className="text-error">{error}</p>
      )}

      {!loading && !error && tickets.length === 0 && (
        <p className="text-base-content/70">
          No doubts found here yet.
        </p>
      )}

      <div className="space-y-3">
        {tickets.map((ticket) => (
          <Link
            key={ticket._id}
            to={`/tickets/${ticket._id}`}
            className="block card shadow-md p-4 bg-base-200 hover:bg-base-300 transition-colors"
          >
            <h3 className="font-bold text-lg">
              {ticket.title}
            </h3>

            <p className="text-sm mt-1">
              {ticket.description}
            </p>

            <div className="flex flex-wrap gap-3 mt-3 text-sm">
              <span>
                **Status:** {ticket.status}
              </span>

              <span className="text-base-content/60">
                Created: {new Date(ticket.createdAt).toLocaleString()}
              </span>
            </div>

            {showPeople && (
              <div className="mt-3 text-sm space-y-1">
                {ticket.createdBy && (
                  <p>
                    <strong>Posted by:</strong>{" "}
                    {ticket.createdBy.name || ticket.createdBy.email}
                  </p>
                )}

                {ticket.assignedTo && (
                  <p>
                    <strong>AI assigned to:</strong>{" "}
                    {ticket.assignedTo.email}
                  </p>
                )}

                {ticket.mentor && (
                  <p>
                    <strong>Mentor:</strong>{" "}
                    {ticket.mentor.name || ticket.mentor.email}
                  </p>
                )}
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
