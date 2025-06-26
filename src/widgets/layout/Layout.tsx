import type { ReactNode } from 'react';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from '../../shared/ui/Header/Header';
import styles from './Layout.module.css';
import { LoginModal } from '../../shared/ui/LoginModal/LoginModal';
import { useUserStore } from '../../shared/store/userStore';
import { useToast } from '../../shared/ui/Toast/useToastStore';

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
  const [loginOpen, setLoginOpen] = useState(false);
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  const handleLogin = (email: string, password: string) => {
    setUser({ email, password });
    setLoginOpen(false);
    toast.success('Logged in');
  };

  const handleLogout = () => {
    if (confirm('Do you really want to logout?')) {
      setUser(null);
      setLoginOpen(false);
      toast.success('Logged out');
    }
  };

  return (
    <div className={styles.layout}>
      <Header
        tabs={tabs}
        tab={tab}
        user={user}
        setLoginOpen={setLoginOpen}
        onLogout={handleLogout}
      />
      <main className={styles.main}>{children}</main>
      <LoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onLogin={handleLogin}
      />
    </div>
  );
};
