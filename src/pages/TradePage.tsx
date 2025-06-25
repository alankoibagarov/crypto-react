import styles from './TradePage.module.css';
import { Transfer } from '../features/transfer/Transfer';

export const TradePage = () => {
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>
        Trade Crypto
      </h1>
      <Transfer />
    </div>
  );
}; 