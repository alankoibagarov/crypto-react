import styles from './TradePage.module.css';

export const TradePage = () => {
  return (
    <div className={styles.wrapper}>
      <h1 className={"text-3xl font-bold mb-4 font-sans " + styles.title}>
        Trade Page
      </h1>
    </div>
  );
}; 