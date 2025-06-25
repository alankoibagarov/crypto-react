import { useNavigate } from "react-router-dom";
import { Button } from "../Button/Button";
import styles from './Header.module.css';
import userImg from '../../../assets/user.png'

export const Header = (
        {
            tabs, 
            tab, 
            user, 
            setLoginOpen,
            onLogout
        }: {
            tabs: {label: string, path: string}[],
            tab: number, 
            user: {email: string, avatarUrl?: string} | null, 
            setLoginOpen: (open: boolean) => void,
            onLogout: () => void
        }
        ) => {
    const navigate = useNavigate();
    
    return (
        <header className={styles.header}>
        <div className={styles.header__container}>
          <span className={styles.header__title}>
            React Crypto App
          </span>
          <nav className={styles.header__nav}>
            {tabs.map((tabItem, index) => (
                <Button
                    key={index}
                    variant={index === 0 ? 'primary' : 'secondary'}
                    onClick={() => navigate(tabItem.path)}
                    active={index === tab}
                >
                    {tabItem.label}
                </Button>
            ))}
          </nav>
        </div>
        <div className={styles.header__container}>
          {user ? (
            <>
            <img className={styles.avatar} src={user.avatarUrl || userImg} alt="avatar"  />
            <span className="font-medium">{user.email}</span>
            <Button onClick={() => onLogout()}>
                Log out
            </Button>
            </>
          ) : (
            <Button onClick={() => setLoginOpen(true)}>
              Log In
            </Button>
          )}
        </div>
      </header>
    );
};