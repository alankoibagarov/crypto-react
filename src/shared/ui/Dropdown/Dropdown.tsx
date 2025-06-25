import { useState, useRef, useEffect, type FC } from 'react';
import styles from './Dropdown.module.css';
import { Button } from '../Button/Button';

interface DropdownProps {
  disabled: boolean
  onBuy: () => void;
  onSell: () => void;
}

export const Dropdown: FC<DropdownProps> = ({ disabled = false, onBuy, onSell }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.dropdown} ref={dropdownRef}>
      <Button disabled={disabled} onClick={toggleDropdown} className={styles.dropdownToggle}>
        Actions
      </Button>
      {isOpen && (
        <div className={styles.dropdownContent}>
          <button disabled={disabled} className={styles.dropdownButton} onClick={() => { onBuy(); setIsOpen(false); }}>
            Buy
          </button>
          <button disabled={disabled} className={styles.dropdownButton} onClick={() => { onSell(); setIsOpen(false); }}>
            Sell
          </button>
        </div>
      )}
    </div>
  );
}; 