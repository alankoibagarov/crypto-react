import { useNavigate } from "react-router-dom";
import { Button } from "../Button/Button";
import styles from './Header.module.css';

export const Header = ({tabs, tab, user, setLoginOpen}: {tabs: {label: string, path: string}[], tab: number, user: {email: string} | null, setLoginOpen: (open: boolean) => void}) => {
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
        <div>
          {user ? (
            <span className="font-medium">{user.email}</span>
          ) : (
            <Button onClick={() => setLoginOpen(true)}>
              Log In
            </Button>
          )}
        </div>
      </header>
    );
};