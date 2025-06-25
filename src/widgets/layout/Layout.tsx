import type { ReactNode } from 'react';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from '../../shared/ui/Header/Header';
import styles from './Layout.module.css';
import { LoginModal } from '../../shared/ui/LoginModal/LoginModal';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
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
  const [user, setUser] = useState<null | { email: string, password: string, avatarUrl?: string }>(null);

  const handleLogin = (email: string, password: string) => {
    setUser({ email, password});
    setLoginOpen(false);
  };

  const handleLogout = () => {
    if(confirm('Do you really want to logout?')) {
      setUser(null);
      setLoginOpen(false);
    }
  };

  return (
    <div className={styles.layout}>
       <Header tabs={tabs} tab={tab} user={user} setLoginOpen={setLoginOpen} onLogout={handleLogout}/>
      <main className={styles.main}>{children}</main>
      <LoginModal 
        open={loginOpen} 
        onClose={() => setLoginOpen(false)}
        onLogin={handleLogin}
      />
    </div>
  );
}; 