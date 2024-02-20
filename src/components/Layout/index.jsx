import { Link, Outlet } from "react-router-dom";
import "./style.scss";

const Layout = () => {
  return (
    <div>
      <div>
        <ul className="menu-list">
          <li>
            <Link to="/">Dashboard</Link>
          </li>
          <li>
            <Link to="/exercise-library">Exercise Library</Link>
          </li>
          <li>
            <Link to="/login">Logout</Link>
          </li>
        </ul>
      </div>
      <Outlet />
    </div>
  );
};

export default Layout;
