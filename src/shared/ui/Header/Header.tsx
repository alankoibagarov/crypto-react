import { useNavigate } from 'react-router-dom';
import { Button } from '../Button/Button';
import styles from './Header.module.css';
import userImg from '../../../assets/user.png';
import logoImg from '../../../assets/blockchain.png';

export const Header = ({
  tabs,
  tab,
  user,
  setLoginOpen,
  onLogout,
}: {
  tabs: { label: string; path: string }[];
  tab: number;
  user: { email: string; avatarUrl?: string } | null;
  setLoginOpen: (open: boolean) => void;
  onLogout: () => void;
}) => {
  const navigate = useNavigate();

  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <img className={styles.logo} src={logoImg} alt="logo" />
        <span className={styles.headerTitle}>React Crypto App</span>
        <nav className={styles.headerNav}>
          {tabs.map((tabItem, index) => (
            <Button
              className={styles.navButton}
              key={index}
              variant={'secondary'}
              onClick={() => navigate(tabItem.path)}
              active={index === tab}
            >
              {tabItem.label}
            </Button>
          ))}
        </nav>
      </div>
      <div className={styles.headerContainer}>
        {user ? (
          <>
            <span className="font-medium">{user.email}</span>
            <img
              className={styles.avatar}
              src={user.avatarUrl || userImg}
              alt="avatar"
            />
            <Button onClick={() => onLogout()}>Log out</Button>
          </>
        ) : (
          <Button onClick={() => setLoginOpen(true)}>Login</Button>
        )}
      </div>
    </header>
  );
};
