import styles from './TradePage.module.css';
import { Transfer } from '@/components/Transfer/Transfer';

const TradePage = () => {
  return (
    <div className={styles.wrapper}>
      <Transfer />
    </div>
  );
};

export default TradePage;
