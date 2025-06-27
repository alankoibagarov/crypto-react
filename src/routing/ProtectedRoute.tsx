// ProtectedRoute.tsx
import { Navigate, useLocation } from 'react-router-dom';
import { useUserStore } from '../store/userStore';
import { useEffect } from 'react';
import { useLoginModalStore } from '../store/loginModalStore';

type Props = {
  children: React.ReactElement;
};

const ProtectedRoute = ({ children }: Props) => {
  const { user } = useUserStore();
  const { setModalOpen } = useLoginModalStore();
  const location = useLocation();

  useEffect(() => {
    if (!user) {
      setModalOpen(true, location.pathname);
    }
  }, []);

  return user ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;
