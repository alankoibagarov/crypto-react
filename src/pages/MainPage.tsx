import { useStore } from '../shared/store/useStore';
import { Button } from '../shared/ui/Button/Button';
import { Table, type Column, type TableRow } from '../shared/ui/Table/Table';
import styles from './MainPage.module.css';
import { type CryptoCoin, fetchCryptoCoins } from '../shared/api/cryptoApi';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Dropdown } from '../shared/ui/Dropdown/Dropdown';

export const MainPage = () => {
  const setLoading = useStore((state) => state.setLoading)
  const assetList = useStore((state) => state.assetList)
  const setAssetList = useStore((state) => state.setAssetList)

  const { data, isSuccess, refetch, isFetching } = useQuery<CryptoCoin[], Error>({
    queryKey: ['cryptoCoins'],
    queryFn: () => fetchCryptoCoins(page),
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (isSuccess) {
      console.log('Success:', data);
      setAssetList([...assetList, ...data])
    }
  }, [isSuccess, data, setAssetList]);

  const columns: Column[] = [
    {
      name: 'Icon',
      key: 'image',
      width: 40,
      renderCell: (value, row) => (
        <img className={styles.icon} src={String(row.image)} alt="Icon"/>
      )
    },
    {
      name: 'Name',
      key: 'name'
    },
    {
      name: 'Price (USD)',
      key: 'current_price',
      renderCell: (value, row) => (
        row.current_price?.toLocaleString('en-US', { maximumFractionDigits: 3 })
      )
    },
    {
      name: '',
      key: 'actions',
      width: 100,
      renderCell: (value, row, rowIndex) => (
        <>
            <div className={styles.actions}>
              <Dropdown disabled={isFetching} onBuy={() => alert('Buy' + rowIndex) } onSell={() => alert('Sell' + rowIndex)}/>
            </div>
        </>
      )
    }
  ]

  const rowsForTable: TableRow[] = assetList ? assetList.map((coin: CryptoCoin) => ({
    id: coin.id,
    name: coin.name,
    symbol: coin.symbol,
    current_price: coin.current_price,
    market_cap: coin.market_cap,
    image: coin.image,
  })) : [];


  const [page, setPage] = useState(1)
  const showMore = async() => {
    setLoading(true)
    await setPage(page + 1)
    await refetch()
    setLoading(false)
  }

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>
        Home
      </h1>
      <Table columns={columns} rows={rowsForTable}/>
      <div className={styles.showMoreBlock}>
        {isFetching
        ? <span className={styles.loader}></span>
        : <Button onClick={showMore}>Show more</Button>
        }
      </div>
    </div>
  );
}; 