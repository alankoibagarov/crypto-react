import styles from './TradePage.module.css';
import { Transfer } from '../features/transfer/Transfer';

export const TradePage = () => {
  return (
    <div className={styles.wrapper}>
      <Transfer />
    </div>
  );
};
