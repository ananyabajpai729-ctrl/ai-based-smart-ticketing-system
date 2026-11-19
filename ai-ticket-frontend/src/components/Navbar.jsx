
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
  const [menuOpen, setMenuOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setMenuOpen(false);
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

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="sticky top-0 z-50 bg-base-100 border-b border-base-300 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="navbar min-h-16 p-0">

          {/* Brand */}
          <div className="flex-1">
            <Link
              to="/"
              onClick={closeMenu}
              className="text-2xl font-bold tracking-tight text-primary"
            >
              CollabNest
              <span className="text-base-content">.</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          {token && (
            <div className="hidden lg:flex items-center gap-1">
              <Link to="/" className={navLinkClass("/")}>
                My Doubts
              </Link>

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
                <Link
                  to="/login"
                  className="btn btn-ghost btn-sm"
                >
                  Login
                </Link>

                <Link
                  to="/signup"
                  className="btn btn-primary btn-sm"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
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

                {/* Mobile menu button */}
                <button
                  className="btn btn-ghost btn-square lg:hidden"
                  onClick={() => setMenuOpen(!menuOpen)}
                  aria-label="Toggle navigation menu"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    {menuOpen ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    )}
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Mobile navigation */}
        {token && menuOpen && (
          <div className="lg:hidden border-t border-base-300 py-3 flex flex-col gap-1">
            <Link to="/" onClick={closeMenu} className={navLinkClass("/")}>
              My Doubts
            </Link>

            <Link
              to="/mentors"
              onClick={closeMenu}
              className={navLinkClass("/mentors")}
            >
              Find Mentors
            </Link>

            <Link
              to="/requests/sent"
              onClick={closeMenu}
              className={navLinkClass("/requests/sent")}
            >
              My Requests
            </Link>

            {user?.canMentor && (
              <Link
                to="/requests/received"
                onClick={closeMenu}
                className={navLinkClass("/requests/received")}
              >
                Received Requests
              </Link>
            )}

            <Link
              to="/profile"
              onClick={closeMenu}
              className={navLinkClass("/profile")}
            >
              Profile
            </Link>

            {user?.role === "admin" && (
              <Link
                to="/admin"
                onClick={closeMenu}
                className={navLinkClass("/admin")}
              >
                Admin
              </Link>
            )}

            <button
              onClick={logout}
              className="btn btn-outline btn-error btn-sm mt-2"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
