import { type FC, useEffect, useState } from 'react';
import styles from './Toast.module.css';
import { SuccessIcon } from '../Icons/SuccessIcon';
import { ErrorIcon } from '../Icons/ErrorIcon';
import { WarningIcon } from '../Icons/WarningIcon';
import { InfoIcon } from '../Icons/InfoIcon';
import { CloseIcon } from '../Icons/CloseIcon';
import { useToastStore, type ToastType, type Toast } from './useToastStore';

const ToastIcon: FC<{ type: ToastType }> = ({ type }) => {
  switch (type) {
    case 'success':
      return <SuccessIcon className={styles.icon} />;
    case 'error':
      return <ErrorIcon className={styles.icon} />;
    case 'warning':
      return <WarningIcon className={styles.icon} />;
    case 'info':
      return <InfoIcon className={styles.icon} />;
  }
};

const ToastItem: FC<{ toast: Toast }> = ({ toast }) => {
  const { removeToast } = useToastStore();
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsClosing(true);
      setTimeout(() => removeToast(toast.id), 300);
    }, 3000);

    return () => clearTimeout(timer);
  }, [toast.id, removeToast]);

  return (
    <div
      className={`${styles.toast} ${styles[toast.type]} ${isClosing ? styles.closing : ''}`}
    >
      <ToastIcon type={toast.type} />
      <span className={styles.message}>{toast.message}</span>
      <button
        className={styles.closeButton}
        onClick={() => {
          setIsClosing(true);
          setTimeout(() => removeToast(toast.id), 300);
        }}
      >
        <CloseIcon className={styles.icon} />
      </button>
    </div>
  );
};

export const ToastContainer: FC = () => {
  const { toasts } = useToastStore();

  return (
    <div className={styles.toastContainer}>
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
};
