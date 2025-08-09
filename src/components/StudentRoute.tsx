import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface StudentRouteProps {
  children: React.ReactNode;
}

const StudentRoute = ({ children }: StudentRouteProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (user.isAdmin) {
      navigate('/admin');
    }
  }, [user, navigate]);

  if (!user || user.isAdmin) {
    return null;
  }

  return <>{children}</>;
};

export default StudentRoute;
