import { useEffect, useState, type FC, type FormEvent } from 'react';
import styles from './LoginModal.module.css';
import { Button } from '@/components/Button/Button';
import { userList } from '@/const/userList';
import { Loader } from '@/components/Loader/Loader';
import { useLoginModalStore } from '@/store/loginModalStore';
import CryptoJS from 'crypto-js';
import { LOGIN_TIMEOUT } from '@/const';

interface LoginModalProps {
  onClose: () => void;
  onLogin: (email: string, password: string, redirectLocation?: string) => void;
}

export const LoginModal: FC<LoginModalProps> = ({ onClose, onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [formErrors, setFormErrors] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const { isModalOpen, redirectLocation } = useLoginModalStore();
  const key = import.meta.env.VITE_ENCRYPTION_KEY;

  useEffect(() => {
    if (isModalOpen) {
      setLoginError('');
      setFormData({ email: '', password: '' });
      setFormErrors({ email: '', password: '' });
    }
  }, [isModalOpen]);

  if (!isModalOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setLoginError('');
    setTimeout(() => {
      if (validateUser()) {
        onLogin(formData.email, redirectLocation);
        setFormData({ email: '', password: '' });
      } else {
        setLoginError('Wrong email or password');
      }
      setLoading(false);
    }, Math.random() * LOGIN_TIMEOUT);
  };

  const validateUser = (): boolean => {
    return userList.some((user: { login: string; password: string }) => {
      const passwordBytes = CryptoJS.AES.decrypt(user.password, key);
      const decryptedPassword = passwordBytes.toString(CryptoJS.enc.Utf8);

      const loginBytes = CryptoJS.AES.decrypt(user.login, key);
      const decryptedLogin = loginBytes.toString(CryptoJS.enc.Utf8);

      return (
        decryptedLogin === formData.email &&
        decryptedPassword === formData.password
      );
    });
  };

  const validateEmail = () => {
    setFormErrors((prev) => ({ ...prev, email: '' }));

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidEmail = (email: string) => emailRegex.test(email);
    if (!isValidEmail(formData.email)) {
      setFormErrors((prev) => ({ ...prev, email: 'Wrong email format' }));
    }
  };

  const validatePassword = () => {
    setFormErrors((prev) => ({ ...prev, password: '' }));

    if (!formData.password) {
      setFormErrors((prev) => ({ ...prev, password: 'Please fill password' }));
    }
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
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            onBlur={validateEmail}
            required
            autoFocus
          />
          <div className={styles.errorText}>{formErrors.email}</div>
          <input
            className={styles.input}
            type="password"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            onBlur={validatePassword}
            required
          />
          <div className={styles.errorText}>{formErrors.password}</div>
          <div className={styles.actions}>
            <div className="text-danger">{loginError}</div>
            <div className={styles.actionButtons}>
              <Button
                disabled={loading}
                type="button"
                variant="secondary"
                onClick={onClose}
              >
                Cancel
              </Button>
              {loading ? (
                <Loader size="32" />
              ) : (
                <Button
                  type="submit"
                  disabled={
                    !!formErrors.email || !!formErrors.password || loading
                  }
                >
                  Login
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
