import { Link, Outlet } from 'react-router-dom';
import Button from '../Button';
import { useNavigate } from 'react-router-dom';
import './style.scss';
import useAuth from '../authentication/useAuth';

const Layout = () => {
  const { navigate } = useNavigate();
  const { onLogOut } = useAuth();

  const onLogOutClick = async () => {
    await onLogOut();
    navigate('/login');
  };

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
            <Button onClick={onLogOutClick}>Logout</Button>
          </li>
        </ul>
      </div>
      <Outlet />
    </div>
  );
};

export default Layout;
