
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const token = localStorage.getItem("token");

  let user = {};
  try {
    user = JSON.parse(localStorage.getItem("user") || "{}");
  } catch {
    user = {};
  }

  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const navLinkClass = (path) => {
    const active = location.pathname === path;

    return `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      active
        ? "bg-primary text-primary-content"
        : "hover:bg-base-300"
    }`;
  };

  return (
    <nav className="sticky top-0 z-50 bg-base-100 border-b border-base-300 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="navbar min-h-16 p-0">

          {/* Brand */}
          <div className="flex-1">
            <Link
              to="/"
              className="text-2xl font-bold tracking-tight text-primary"
            >
              CollabNest<span className="text-base-content">.</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          {token && (

            <div className="hidden lg:flex items-center gap-1">
              <Link to="/" className={navLinkClass("/")}>
                My Doubts
              </Link>

              {(user?.role === "moderator" || user?.role === "admin") && (
                <Link to="/assigned" className={navLinkClass("/assigned")}>
                  Assigned to Me
                </Link>
              )}

              {user?.canMentor && (
                <Link to="/mentoring" className={navLinkClass("/mentoring")}>
                  Mentoring
                </Link>
              )}

              {user?.role === "admin" && (
                <Link to="/all-doubts" className={navLinkClass("/all-doubts")}>
                  All Doubts
                </Link>
              )}

              <Link to="/mentors" className={navLinkClass("/mentors")}>
                Find Mentors
              </Link>

              <Link
                to="/requests/sent"
                className={navLinkClass("/requests/sent")}
              >
                My Requests
              </Link>

              {user?.canMentor && (
                <Link
                  to="/requests/received"
                  className={navLinkClass("/requests/received")}
                >
                  Received Requests
                </Link>
              )}

              {user?.role === "admin" && (
                <Link to="/admin" className={navLinkClass("/admin")}>
                  Admin
                </Link>
              )}
            </div>
          )}

          {/* Account actions */}
          <div className="flex items-center gap-2 ml-auto lg:ml-5">
            {!token ? (
              <>
                <Link to="/login" className="btn btn-ghost btn-sm">
                  Login
                </Link>

                <Link to="/signup" className="btn btn-primary btn-sm">
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <Link to="/my-projects" className={navLinkClass("/my-projects")}>
                    My Projects
                </Link>
                <Link
                    to="/project-invitations"
                    className={navLinkClass("/project-invitations")}
                >
                    Project Invitations
                </Link>
                <Link
                    to="/sent-project-invitations"
                    className={navLinkClass("/sent-project-invitations")}
                >
                    Sent Invitations
                </Link>
                <Link
                  to="/profile"
                  className={`hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${
                    location.pathname === "/profile"
                      ? "bg-primary text-primary-content"
                      : "hover:bg-base-300"
                  }`}
                >
                  <span className="w-8 h-8 rounded-full bg-primary/15 text-primary flex items-center justify-center font-bold">
                    {(user?.name || user?.email || "U")
                      .charAt(0)
                      .toUpperCase()}
                  </span>

                  <span className="max-w-28 truncate">
                    {user?.name || "My Profile"}
                  </span>
                </Link>

                <button
                  onClick={logout}
                  className="btn btn-outline btn-error btn-sm hidden sm:flex"
                >
                  Logout
                </button>
              </>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}
