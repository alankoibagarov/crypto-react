import type { ButtonHTMLAttributes, FC } from 'react';
import styles from './Button.module.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  active?: boolean;
}

export const Button: FC<ButtonProps> = ({ variant = 'primary', className = '', active = false, ...props }) => {
  return (
    <button
      className={[
        styles.button,
        variant === 'secondary' ? styles.secondary : '',
        active ? styles.active : styles.secondary,
        className
      ].join(' ').trim()}
      {...props}
    />
  );
}; 