import { useAssetStore } from '../shared/store/assetStore';
import { Button } from '../shared/ui/Button/Button';
import { Table, type Column, type TableRow } from '../shared/ui/Table/Table';
import styles from './MainPage.module.css';
import { type CryptoCoin, fetchCryptoCoins } from '../shared/api/cryptoApi';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Dropdown } from '../shared/ui/Dropdown/Dropdown';
import { useUserStore } from '../shared/store/userStore';
import { Loader } from '../shared/ui/Loader/Loader';

export const MainPage = () => {
  const user = useUserStore((state) => state.user)

  const setLoading = useAssetStore((state) => state.setLoading)
  const assetList = useAssetStore((state) => state.assetList)
  const setAssetList = useAssetStore((state) => state.setAssetList)

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
      renderCell: (_, row) => (
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
      renderCell: (_, row) => (
        row.current_price?.toLocaleString('en-US', { maximumFractionDigits: 3 })
      )
    },
    {
      name: '',
      key: 'actions',
      width: 100,
      renderCell: () => (
        <>
            <div title={!user ? 'Please log in' : ''} className={styles.actions}>
              <Dropdown  disabled={isFetching || !user} onBuy={() => alert('Buy') } onSell={() => alert('Sell')}/>
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
        ? <Loader/>
        : <Button onClick={showMore}>Show more</Button>
        }
      </div>
    </div>
  );
}; 