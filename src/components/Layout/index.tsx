import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import "./style.scss";
import useAuth from "../authentication/useAuth";

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { onLogOut, name } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const onLogOutClick = async () => {
    setMenuOpen(false);
    await onLogOut();
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "??";

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="app-shell">
      <header className="topnav">
        <span className="topnav-logo">Volum</span>
        <nav className="topnav-links">
          <Link
            to="/exercise-library"
            className={`topnav-link${isActive("/exercise-library") ? " active" : ""}`}
          >
            Library
          </Link>
          <Link
            to="/"
            className={`topnav-link${isActive("/workouts") ? " active" : ""}`}
          >
            Workouts
          </Link>
          <Link
            to="/"
            className={`topnav-link${isActive("/progress") ? " active" : ""}`}
          >
            Progress
          </Link>
          <Link
            to="/"
            className={`topnav-link${isActive("/profile") ? " active" : ""}`}
          >
            Profile
          </Link>
        </nav>
        <div className="topnav-actions">
          <div className="topnav-user-menu" ref={menuRef}>
            <button
              className="topnav-user-avatar"
              onClick={() => setMenuOpen((o) => !o)}
              title={name || "User"}
            >
              {initials}
            </button>
            {menuOpen && (
              <div className="topnav-dropdown">
                <div className="topnav-dropdown-header">{name}</div>
                <button
                  className="topnav-dropdown-item"
                  onClick={onLogOutClick}
                >
                  <span className="material-symbols-outlined">logout</span>
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
