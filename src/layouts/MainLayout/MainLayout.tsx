import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header/Header';
import styles from './MainLayout.module.css';
import { LoginModal } from '@/components/LoginModal/LoginModal';
import { useUserStore } from '@/store/userStore';
import { useToast } from '@/store/useToastStore';
import { useLoginModalStore } from '@/store/loginModalStore';
import {
  MAIN_LAYOUT_TRADE_TAB_INDEX,
  MAIN_LAYOUT_HOME_TAB_INDEX,
} from '@/const';

export const MainLayout = () => {
  const toast = useToast();
  const location = useLocation();
  const tab =
    location.pathname === '/trade'
      ? MAIN_LAYOUT_TRADE_TAB_INDEX
      : MAIN_LAYOUT_HOME_TAB_INDEX;
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

  const handleLogin = async (email: string, redirectLocation?: string) => {
    await setUser({ email });
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
      <main className={styles.main}>
        <Outlet />
      </main>
      <LoginModal onClose={() => setModalOpen(false)} onLogin={handleLogin} />
    </div>
  );
};
