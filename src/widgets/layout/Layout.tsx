import type { ReactNode } from 'react';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '../../shared/ui/Button/Button';
import { Header } from '../../shared/ui/Header/Header';
import styles from './Layout.module.css';

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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState<null | { email: string }>(null);

  const handleLogin = () => {
    setUser({ email });
    setLoginOpen(false);
    setEmail('');
    setPassword('');
  };

  return (
    <div className={styles.layout}>
       <Header tabs={tabs} tab={tab} user={user} setLoginOpen={setLoginOpen} />
      <main className={styles.main}>{children}</main>
      {loginOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2 className={styles.modalTitle}>Log In</h2>
            <form
              className={styles.form}
              onSubmit={e => {
                e.preventDefault();
                handleLogin();
              }}
            >
              <input
                className={styles.input}
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoFocus
              />
              <input
                className={styles.input}
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <Button
                type="submit"
                disabled={!email || !password}
              >
                Log In
              </Button>
              <Button
                type="button"
                variant="secondary"
                className={styles.cancelBtn}
                onClick={() => setLoginOpen(false)}
              >
                Cancel
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}; 