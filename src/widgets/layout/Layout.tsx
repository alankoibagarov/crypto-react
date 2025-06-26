import type { ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Header } from '../../shared/ui/Header/Header';
import styles from './Layout.module.css';
import { LoginModal } from '../../shared/ui/LoginModal/LoginModal';
import { useUserStore } from '../../shared/store/userStore';
import { useToast } from '../../shared/store/useToastStore';
import { useLoginModalStore } from '../../shared/store/loginModalStore';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const toast = useToast();
  const location = useLocation();
  const tab = location.pathname === '/trade' ? 1 : 0;
  const tabs = [
    {
      label: 'Home',
      path: '/',
    },
    {
      label: 'Trade',
      path: '/trade',
    },
  ];

  const { setModalOpen } = useLoginModalStore();
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const navigate = useNavigate();

  const handleLogin = async (
    email: string,
    password: string,
    redirectLocation?: string
  ) => {
    await setUser({ email, password });
    await setModalOpen(false);
    toast.success('Logged in');

    if (redirectLocation) {
      navigate(redirectLocation, { replace: true });
    }
  };

  const handleLogout = () => {
    if (confirm('Do you really want to logout?')) {
      setUser(null);
      setModalOpen(false);
      toast.success('Logged out');
    }
  };

  return (
    <div className={styles.layout}>
      <Header
        tabs={tabs}
        tab={tab}
        user={user}
        setLoginOpen={setModalOpen}
        onLogout={handleLogout}
      />
      <main className={styles.main}>{children}</main>
      <LoginModal onClose={() => setModalOpen(false)} onLogin={handleLogin} />
    </div>
  );
};
