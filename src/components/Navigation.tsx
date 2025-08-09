import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Navigation = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-app-white text-lg font-medium px-4 py-2 transition-all story-link hover-scale ${
      isActive ? 'border-b-2 border-app-white' : 'hover:opacity-80'
    }`;

return (
  <nav className="flex items-center justify-between mb-8">
    <div className="flex space-x-8">
      {user?.isAdmin ? (
        <>
          <NavLink to="/admin" className={navLinkClass}>
            Admin
          </NavLink>
          <NavLink to="/profile" className={navLinkClass}>
            Profile
          </NavLink>
        </>
      ) : (
        <>
          <NavLink to="/dashboard" className={navLinkClass}>
            Dashboard
          </NavLink>
          <NavLink to="/recycle-history" className={navLinkClass}>
            Recycle History
          </NavLink>
          <NavLink to="/profile" className={navLinkClass}>
            Profile
          </NavLink>
        </>
      )}
    </div>
    <button
      onClick={handleLogout}
      className="text-app-white text-lg font-medium px-4 py-2 hover:opacity-80 transition-all"
    >
      Logout
    </button>
  </nav>
);
};

export default Navigation;