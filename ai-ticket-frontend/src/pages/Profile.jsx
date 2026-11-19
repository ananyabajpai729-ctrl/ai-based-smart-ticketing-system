
import { useEffect, useState } from "react";

export default function Profile() {
  const [profile, setProfile] = useState({
    name: "",
    bio: "",
    skills: [],
    interests: [],
    canMentor: false,
    lookingForTeam: false
  });

  const [skillInput, setSkillInput] = useState("");
  const [interestInput, setInterestInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/auth/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch profile");
        }

        setProfile({
          name: data.name || "",
          bio: data.bio || "",
          skills: data.skills || [],
          interests: data.interests || [],
          canMentor: data.canMentor || false,
          lookingForTeam: data.lookingForTeam || false
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setProfile({
      ...profile,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const addItem = (field, value, clearInput) => {
    const trimmedValue = value.trim();

    if (!trimmedValue) return;

    const alreadyExists = profile[field].some(
      item => item.toLowerCase() === trimmedValue.toLowerCase()
    );

    if (!alreadyExists) {
      setProfile({
        ...profile,
        [field]: [...profile[field], trimmedValue]
      });
    }

    clearInput("");
  };

  const removeItem = (field, itemToRemove) => {
    setProfile({
      ...profile,
      [field]: profile[field].filter(item => item !== itemToRemove)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/auth/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(profile)
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Profile update failed");
      }

      setProfile(data.user);
      const existingUser = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem(
        "user",
        JSON.stringify({ ...existingUser, ...data.user })
      );
      setMessage("Profile updated successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Loading profile...</p>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">My Profile</h1>
      <p className="text-base-content/60 mb-6">
        Tell other students about yourself, your skills and what you're looking for.
      </p>

      <form onSubmit={handleSubmit} className="card bg-base-200 shadow-md">
        <div className="card-body space-y-4">

          <div>
            <label className="label">
              <span className="label-text font-semibold">Name</span>
            </label>
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
              placeholder="Your name"
              className="input input-bordered w-full"
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text font-semibold">Bio</span>
            </label>
            <textarea
              name="bio"
              value={profile.bio}
              onChange={handleChange}
              placeholder="Write a little about yourself..."
              className="textarea textarea-bordered w-full"
              rows={4}
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text font-semibold">Skills</span>
            </label>

            <div className="flex gap-2">
              <input
                value={skillInput}
                onChange={e => setSkillInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addItem("skills", skillInput, setSkillInput);
                  }
                }}
                placeholder="e.g. Java, React, Python"
                className="input input-bordered flex-1"
              />
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => addItem("skills", skillInput, setSkillInput)}
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mt-3">
              {profile.skills.map(skill => (
                <span key={skill} className="badge badge-lg gap-2 p-3">
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeItem("skills", skill)}
                    aria-label={`Remove ${skill}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="label">
              <span className="label-text font-semibold">Interests</span>
            </label>

            <div className="flex gap-2">
              <input
                value={interestInput}
                onChange={e => setInterestInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addItem("interests", interestInput, setInterestInput);
                  }
                }}
                placeholder="e.g. Backend Development, AI"
                className="input input-bordered flex-1"
              />
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => addItem("interests", interestInput, setInterestInput)}
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mt-3">
              {profile.interests.map(interest => (
                <span key={interest} className="badge badge-info badge-lg gap-2 p-3">
                  {interest}
                  <button
                    type="button"
                    onClick={() => removeItem("interests", interest)}
                    aria-label={`Remove ${interest}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="divider" />

          <label className="label cursor-pointer justify-start gap-3">
            <input
              type="checkbox"
              name="canMentor"
              checked={profile.canMentor}
              onChange={handleChange}
              className="checkbox checkbox-primary"
            />
            <span className="label-text">
              I'm open to mentoring other students
            </span>
          </label>

          <label className="label cursor-pointer justify-start gap-3">
            <input
              type="checkbox"
              name="lookingForTeam"
              checked={profile.lookingForTeam}
              onChange={handleChange}
              className="checkbox checkbox-primary"
            />
            <span className="label-text">
              I'm looking for project teammates
            </span>
          </label>

          {error && (
            <p className="text-error text-sm">{error}</p>
          )}

          {message && (
            <p className="text-success text-sm">{message}</p>
          )}

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>

        </div>
      </form>
    </div>
  );
}
