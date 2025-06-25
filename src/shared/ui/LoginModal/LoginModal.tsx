import { useState, type FC, type FormEvent } from 'react';
import styles from './LoginModal.module.css';
import { Button } from '../Button/Button';

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  onLogin: (email: string, password: string) => void;
}

export const LoginModal: FC<LoginModalProps> = ({ open = false, onClose, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false)

  if (!open) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setTimeout(() => {
        onLogin(email, password);
        setEmail('');
        setPassword('');
        setLoading(false);
    }, Math.random() * 3000);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.title}>Log In</div>
        <form className={styles.form} onSubmit={handleSubmit}>
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
          <div className={styles.actions}>
            <Button type="submit" disabled={!email || !password || loading}>
              Log In
            </Button>
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
          </div>
          {loading ? 'loading...' : ''}
        </form>
      </div>
    </div>
  );
};