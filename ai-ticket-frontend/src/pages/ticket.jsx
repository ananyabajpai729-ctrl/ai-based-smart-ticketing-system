
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { useNavigate } from "react-router-dom";

export default function TicketDetailsPage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const { id } = useParams();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const token = localStorage.getItem("token");
  const BASE_URL = import.meta.env.VITE_SERVER_URL;

  const fetchTicket = async () => {
    try {
      const res = await fetch(`${BASE_URL}/tickets/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setTicket(data.ticket || data);
      } else {
        alert(data.message || data.error || "Failed to fetch ticket");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await fetch(`${BASE_URL}/discussions/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setMessages(data.messages || []);
      } else {
        console.error(data.message || "Failed to fetch discussion");
      }
    } catch (err) {
      console.error("Failed to fetch discussion:", err);
    }
  };

  useEffect(() => {
    fetchTicket();
    fetchMessages();
  }, [id]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!message.trim()) return;

    setSending(true);

    try {
      const res = await fetch(`${BASE_URL}/discussions/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessages((prev) => [...prev, data.data]);
        setMessage("");
      } else {
        alert(data.message || "Failed to send message");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong while sending the message");
    } finally {
      setSending(false);
    }
  };
  const handleResolve = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to mark this doubt as resolved?"
    );

    if (!confirmed) return;

    try {
      const res = await fetch(
        `${BASE_URL}/tickets/${id}/resolve`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (res.ok) {
        setTicket(data.ticket);
        alert("Doubt marked as resolved!");
      } else {
        alert(data.message || "Failed to resolve doubt");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  if (loading)
    return <div className="text-center mt-10">Loading ticket details...</div>;

  if (!ticket)
    return <div className="text-center mt-10">Ticket not found</div>;

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6 ">
      <h2 className="text-2xl font-bold">Ticket Details</h2>

      {/* Original doubt details */}
      <div className="card bg-green-400 shadow p-4 space-y-4">
        <h3 className="text-xl font-semibold">{ticket.title}</h3>
        <p>{ticket.description}</p>

        {ticket.status && (
          <>
            <div className="divider">Metadata</div>

            <p>
              <strong>Status:</strong> {ticket.status}
            </p>
            {user?._id === (ticket.createdBy?._id || ticket.createdBy) &&
              ticket.status !== "closed" && (
                <button
                  onClick={handleResolve}
                  className="btn btn-success"
                >
                  Mark as Resolved
                </button>
            )}

            {ticket.priority && (
              <p>
                <strong>Priority:</strong> {ticket.priority}
              </p>
            )}

            {ticket.relatedSkills?.length > 0 && (
              <p>
                <strong>Related Skills:</strong>{" "}
                {ticket.relatedSkills.join(", ")}
              </p>
            )}

            {ticket.helpfulNotes && (
              <div>
                <strong>Helpful Notes:</strong>
                <div className="prose max-w-none rounded mt-2">
                  <ReactMarkdown>{ticket.helpfulNotes}</ReactMarkdown>
                </div>
              </div>
            )}

            {ticket.assignedTo && (
              <p>
                <strong>Assigned To:</strong> {ticket.assignedTo?.email}
              </p>
            )}

            {ticket.createdAt && (
              <p className="text-sm text-gray-500 mt-2">
                Created At: {new Date(ticket.createdAt).toLocaleString()}
              </p>
            )}
          </>
        )}
      </div>

      {/* Discussion thread */}
      <div className="card bg-gray-800 shadow p-4 space-y-4">
        <h3 className="text-xl font-semibold">Discussion</h3>

        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg._id} className="bg-gray-700 rounded-lg p-3">
              <div className="flex justify-between items-center gap-2 mb-2">
                <strong>{msg.sender?.name || "User"}</strong>
                <span className="text-xs text-gray-400">
                  {new Date(msg.createdAt).toLocaleString()}
                </span>
              </div>

              <p className="whitespace-pre-wrap">{msg.message}</p>
            </div>
          ))}

          {messages.length === 0 && (
            <p className="text-gray-400">
              No messages yet. Start the discussion!
            </p>
            
          )}
          
        </div>


        {ticket.status !== "closed" ? (
          <form onSubmit={handleSendMessage} className="space-y-3">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your message..."
              className="textarea textarea-bordered w-full"
              required
            />

            <button
              type="submit"
              className="btn btn-primary"
              disabled={sending || !message.trim()}
            >
              {sending ? "Sending..." : "Send Message"}
            </button>
          </form>
        ) : (
          <p className="text-success font-semibold">
            This doubt has been resolved. The discussion is now read-only.
          </p>
        )}
      </div>
    </div>
  );
}
