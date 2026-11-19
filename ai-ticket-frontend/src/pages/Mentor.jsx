
import { useEffect, useState } from "react";

export default function Mentors() {
  const [mentors, setMentors] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Request modal states
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [myDoubts, setMyDoubts] = useState([]);
  const [selectedDoubt, setSelectedDoubt] = useState("");
  const [message, setMessage] = useState("");
  const [loadingDoubts, setLoadingDoubts] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [requestError, setRequestError] = useState("");
  const [success, setSuccess] = useState("");

  const token = localStorage.getItem("token");
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/auth/mentors`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch mentors");
        }

        setMentors(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMentors();
  }, [token]);

  const filteredMentors = mentors.filter(mentor => {
    const query = search.toLowerCase();

    return (
      mentor.name?.toLowerCase().includes(query) ||
      mentor.skills?.some(skill =>
        skill.toLowerCase().includes(query)
      ) ||
      mentor.interests?.some(interest =>
        interest.toLowerCase().includes(query)
      )
    );
  });

  // Open request modal and fetch student's doubts
  const openRequestModal = async (mentor) => {
    setSelectedMentor(mentor);
    setSelectedDoubt("");
    setMessage("");
    setRequestError("");
    setSuccess("");
    setLoadingDoubts(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/tickets`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch your doubts");
      }

      setMyDoubts(data);
    } catch (err) {
      setRequestError(err.message);
    } finally {
      setLoadingDoubts(false);
    }
  };

  const closeRequestModal = () => {
    setSelectedMentor(null);
    setMyDoubts([]);
    setSelectedDoubt("");
    setMessage("");
    setRequestError("");
  };

  // Submit mentorship request
  const sendRequest = async () => {
    if (!selectedDoubt) {
      setRequestError("Please select a doubt first.");
      return;
    }

    setSubmitting(true);
    setRequestError("");
    setSuccess("");

    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/requests`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            mentorId: selectedMentor._id,
            ticketId: selectedDoubt,
            message
          })
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to send request");
      }

      setSuccess("Mentorship request sent successfully!");
      setSelectedDoubt("");
      setMessage("");

    } catch (err) {
      setRequestError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Loading mentors...</p>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">Find Mentors</h1>

      <p className="text-base-content/60 mb-6">
        Connect with students who are willing to share their knowledge.
      </p>

      <input
        type="text"
        placeholder="Search by name, skill or interest..."
        className="input input-bordered w-full mb-6"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {error && <p className="text-error mb-4">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredMentors
          .filter(mentor => mentor._id !== currentUser._id)
          .map(mentor => (
          <div
            key={mentor._id}
            className="card bg-base-200 shadow-md"
          >
            <div className="card-body">
              <h2 className="card-title">
                {mentor.name || "Unnamed Student"}
              </h2>

              <p className="text-sm opacity-70">
                {mentor.bio || "No bio added yet."}
              </p>

              <div>
                <h3 className="font-semibold mt-3 mb-2">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {mentor.skills?.length ? (
                    mentor.skills.map(skill => (
                      <span key={skill} className="badge badge-primary">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm opacity-60">
                      No skills listed
                    </span>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mt-3 mb-2">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {mentor.interests?.length ? (
                    mentor.interests.map(interest => (
                      <span key={interest} className="badge badge-outline">
                        {interest}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm opacity-60">
                      No interests listed
                    </span>
                  )}
                </div>
              </div>

              <div className="card-actions justify-end mt-4">
                <button
                  className="btn btn-primary"
                  onClick={() => openRequestModal(mentor)}
                >
                  Request Mentorship
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredMentors.filter(
        mentor => mentor._id !== currentUser._id
      ).length === 0 && (
        <p className="text-center mt-10 opacity-60">
          {search
            ? "No mentors match your search."
            : "No mentors available yet."}
        </p>
      )}

      {/* Request Modal */}
      {selectedMentor && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h2 className="text-xl font-bold mb-2">
              Request Mentorship
            </h2>

            <p className="text-sm opacity-70 mb-4">
              Sending a request to {selectedMentor.name}.
              Select the doubt you need help with.
            </p>

            {loadingDoubts ? (
              <p>Loading your doubts...</p>
            ) : (
              <>
                <label className="label">
                  <span className="label-text">Select a doubt</span>
                </label>

                <select
                  className="select select-bordered w-full"
                  value={selectedDoubt}
                  onChange={e => setSelectedDoubt(e.target.value)}
                >
                  <option value="">Choose a doubt</option>

                  {myDoubts.map(doubt => (
                    <option key={doubt._id} value={doubt._id}>
                      {doubt.title}
                    </option>
                  ))}
                </select>

                {myDoubts.length === 0 && (
                  <p className="text-sm text-warning mt-2">
                    You haven't posted any doubts yet.
                    Post a doubt before requesting mentorship.
                  </p>
                )}

                <label className="label mt-3">
                  <span className="label-text">
                    Message (optional)
                  </span>
                </label>

                <textarea
                  className="textarea textarea-bordered w-full"
                  placeholder="Explain what kind of guidance you need..."
                  value={message}
                  maxLength={500}
                  onChange={e => setMessage(e.target.value)}
                />

                <p className="text-xs opacity-60 text-right">
                  {message.length}/500
                </p>
              </>
            )}

            {requestError && (
              <p className="text-error text-sm mt-3">
                {requestError}
              </p>
            )}

            {success && (
              <p className="text-success text-sm mt-3">
                {success}
              </p>
            )}

            <div className="modal-action">
              <button
                className="btn btn-ghost"
                onClick={closeRequestModal}
                disabled={submitting}
              >
                Close
              </button>

              <button
                className="btn btn-primary"
                onClick={sendRequest}
                disabled={
                  submitting ||
                  loadingDoubts ||
                  myDoubts.length === 0 ||
                  !!success
                }
              >
                {submitting ? "Sending..." : "Send Request"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
