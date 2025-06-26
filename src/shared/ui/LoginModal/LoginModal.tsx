import { useEffect, useState, type FC, type FormEvent } from 'react';
import styles from './LoginModal.module.css';
import { Button } from '../Button/Button';
import { userList } from '../../../const/user';
import { Loader } from '../Loader/Loader';
import { useLoginModalStore } from '../../store/loginModalStore';

interface LoginModalProps {
  onClose: () => void;
  onLogin: (email: string, password: string, redirectLocation?: string) => void;
}

export const LoginModal: FC<LoginModalProps> = ({ onClose, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const { isModalOpen, redirectLocation } = useLoginModalStore();

  useEffect(() => {
    if (isModalOpen) {
      setLoginError('');
    }
  }, [isModalOpen]);

  if (!isModalOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setLoginError('');
    setTimeout(() => {
      if (validateUser(email, password)) {
        onLogin(email, password, redirectLocation);
        setEmail('');
        setPassword('');
      } else {
        setLoginError('Wrong email or password');
      }
      setLoading(false);
    }, Math.random() * 3000);
  };

  const validateUser = (email: string, password: string): boolean => {
    return userList.some(
      (user) => user.login === email && user.password === password
    );
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.title}>Login</div>
        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            className={styles.input}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
          />
          <input
            className={styles.input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className={styles.actions}>
            <Button
              disabled={loading}
              type="button"
              variant="secondary"
              onClick={onClose}
            >
              Cancel
            </Button>
            {loading ? (
              <Loader />
            ) : (
              <Button type="submit" disabled={!email || !password || loading}>
                Login
              </Button>
            )}
          </div>
          {loginError && <p className="text-danger">{loginError}</p>}
        </form>
      </div>
    </div>
  );
};
