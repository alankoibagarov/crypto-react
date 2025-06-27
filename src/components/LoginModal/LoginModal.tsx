import { useEffect, useState, type FC, type FormEvent } from 'react';
import styles from './LoginModal.module.css';
import { Button } from '@/components/Button/Button';
import { Loader } from '@/components/Loader/Loader';
import { useLoginModalStore } from '@/store/loginModalStore';
import CryptoJS from 'crypto-js';
import { fetchUserList, type UserListItem } from '@/api/authApi';
import { useToast } from '@/store/useToastStore';

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
  const toast = useToast();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValidEmail = (email: string) => emailRegex.test(email);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setLoginError('');

    try {
      const users = await fetchUserList();

      if (handleUserValidation(users)) {
        onLogin(formData.email, redirectLocation);
        setFormData({ email: '', password: '' });
      } else {
        setLoginError('Wrong email or password');
      }
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'message' in error) {
        toast.error((error as { message: string }).message);
      } else {
        toast.error('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const isLoginButtonDisabled = (): boolean => {
    return !isValidEmail(formData.email) || !formData.password || loading;
  };

  const handleUserValidation = (users: UserListItem[]): boolean => {
    return users.some((user: UserListItem) => {
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

  const handleEmailValidation = () => {
    setFormErrors((prev) => ({ ...prev, email: '' }));

    if (formData.email && !isValidEmail(formData.email)) {
      setFormErrors((prev) => ({ ...prev, email: 'Wrong email format' }));
    }
  };

  const handlePasswordValidation = () => {
    setFormErrors((prev) => ({ ...prev, password: '' }));

    if (!formData.password) {
      setFormErrors((prev) => ({ ...prev, password: 'Please fill password' }));
    }
  };

  // Clear modal data on modal open
  useEffect(() => {
    if (isModalOpen) {
      setLoginError('');
      setFormData({ email: '', password: '' });
      setFormErrors({ email: '', password: '' });
    }
  }, [isModalOpen]);

  if (!isModalOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.title}>Login</div>
        <form className={styles.form} onSubmit={handleFormSubmit}>
          <input
            className={styles.input}
            type="email"
            placeholder="Email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            onBlur={handleEmailValidation}
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
            onBlur={handlePasswordValidation}
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
                <Button type="submit" disabled={isLoginButtonDisabled()}>
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
