import { type FC, useEffect, useState } from 'react';
import styles from './Toast.module.css';
import { SuccessIcon } from '@/components/Icons/SuccessIcon';
import { ErrorIcon } from '@/components/Icons/ErrorIcon';
import { WarningIcon } from '@/components/Icons/WarningIcon';
import { InfoIcon } from '@/components/Icons/InfoIcon';
import { CloseIcon } from '@/components/Icons/CloseIcon';
import {
  useToastStore,
  type ToastType,
  type Toast,
} from '@/store/useToastStore';
import { TOAST_DELAY, TOAST_TIMEOUT } from '@/const';

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

  // Remove toast by timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsClosing(true);
      setTimeout(() => removeToast(toast.id), TOAST_DELAY);
    }, TOAST_TIMEOUT);

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
          setTimeout(() => removeToast(toast.id), TOAST_DELAY);
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
