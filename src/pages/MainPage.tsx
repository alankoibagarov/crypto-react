import { Table } from '../shared/ui/Table/Table';
import styles from './MainPage.module.css';

export const MainPage = () => {
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>
        Welcome to React Crypto App
      </h1>
      <Table columns={['a', 'b', 'c' ,'d']} rows={[1,2,3,4]}/>
    </div>
  );
}; 