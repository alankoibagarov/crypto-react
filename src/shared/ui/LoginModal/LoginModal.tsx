import { useEffect, useState, type FC, type FormEvent } from 'react';
import styles from './LoginModal.module.css';
import { Button } from '../Button/Button';
import { userList } from '../../mocks/user';
import { Loader } from '../Loader/Loader';

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  onLogin: (email: string, password: string) => void;
}

export const LoginModal: FC<LoginModalProps> = ({ open = false, onClose, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false)
  const [loginError, setLoginError] = useState('')

  useEffect(() => {
    if(open) {
        setLoginError('')
    }
  },[open])

  if (!open) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setLoginError('')
    setTimeout(() => {
        if(validateUser(email, password)) {
            onLogin(email, password);
            setEmail('');
            setPassword('');
        } else {
            setLoginError('Wrong email or password')
        }
        setLoading(false);
    }, Math.random() * 3000);
  };

  const validateUser = (email: string, password: string): boolean => {
    return userList.some(user => user.login === email && user.password === password)
  }

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
            {loading ? (
                <Loader/>
            ) 
            : (
                <Button type="submit" disabled={!email || !password || loading}>
                Log In
              </Button>
            )}
            <Button disabled={loading} type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
          </div>
          {loginError && (
            <p className='text-danger'>
                {loginError}
            </p>
          )}

        </form>
      </div>
    </div>
  );
};