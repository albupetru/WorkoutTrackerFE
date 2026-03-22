import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import "./style.scss";
import useAuth from "../authentication/useAuth";

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { onLogOut, name, role } = useAuth();

  const onLogOutClick = async () => {
    await onLogOut();
    navigate("/login");
  };

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
    <div>
      <aside className="sidebar">
        <div className="sidebar-logo">Volum</div>

        <div className="sidebar-user">
          <div className="sidebar-user-avatar">{initials}</div>
          <div className="sidebar-user-info">
            <span className="sidebar-user-name">{name || "User"}</span>
            <span className="sidebar-user-subtitle">{role || "Role"}</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <Link
            to="/exercise-library"
            className={`sidebar-nav-item${isActive("/exercise-library") ? " active" : ""}`}
          >
            <span className="material-symbols-outlined">fitness_center</span>
            Library
          </Link>
          <Link
            to="/"
            className={`sidebar-nav-item${isActive("/workouts") ? " active" : ""}`}
          >
            <span className="material-symbols-outlined">calendar_today</span>
            Workouts
          </Link>
          <Link
            to="/"
            className={`sidebar-nav-item${isActive("/progress") ? " active" : ""}`}
          >
            <span className="material-symbols-outlined">trending_up</span>
            Progress
          </Link>
          <Link
            to="/"
            className={`sidebar-nav-item${isActive("/profile") ? " active" : ""}`}
          >
            <span className="material-symbols-outlined">person</span>
            Profile
          </Link>
          <button
            className="sidebar-nav-item sidebar-logout-btn"
            onClick={onLogOutClick}
          >
            <span className="material-symbols-outlined">logout</span>
            Log out
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="sidebar-start-btn">
            <span className="material-symbols-outlined">play_arrow</span>
            Start Workout
          </button>
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
