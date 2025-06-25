import type { ButtonHTMLAttributes, FC } from 'react';
import styles from './Button.module.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  active?: boolean;
}

export const Button: FC<ButtonProps> = ({ variant = 'primary', className = '', active = false, ...props }) => {

  const getButtonColor = (variant: ButtonProps['variant']) => {
    switch (variant) {
        case 'primary':
            return styles.primary
        case 'success':
            return styles.success
        case 'danger':
            return styles.danger
        default:
            return styles.secondary
    }
  }

  return (
    <button
      className={[
        styles.button,
        getButtonColor(variant),
        active ? styles.active : styles.secondary,
        className
      ].join(' ').trim()}
      {...props}
    />
  );
}; 