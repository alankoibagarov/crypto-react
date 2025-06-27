import styles from './Loader.module.css';

export const Loader = ({ size = '' }: { size?: string }) => {
  return (
    <span
      className={styles.loader}
      style={{ width: `${size}px`, height: `${size}px` }}
    ></span>
  );
};
