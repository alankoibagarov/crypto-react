import { useAssetStore } from '@/store/assetStore';
import { Button } from '@/components/Button/Button';
import { Table, type Column, type TableRow } from '@/components/Table/Table';
import styles from './MainPage.module.css';
import { type CryptoCoin, fetchCryptoCoins } from '@/api/cryptoApi';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Dropdown } from '@/components/Dropdown/Dropdown';
import { useUserStore } from '@/store/userStore';
import { Loader } from '@/components/Loader/Loader';
import { useToast } from '@/store/useToastStore';
import { useLoginModalStore } from '@/store/loginModalStore';
import { Action } from '@/enums';
import {
  DEFAULT_PAGE,
  TABLE_ICON_WIDTH,
  TABLE_ACTIONS_WIDTH,
  PRICE_MAX_FRACTION_DIGITS,
} from '@/const';
import { NoCoin } from '@components/Icons/NoCoin';

// Preload all crypto icons from assets/crypto using Vite's import.meta.glob
const cryptoIcons = import.meta.glob('../../assets/crypto/*.png', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;
const NO_ICON_SRC = <NoCoin className={styles.icon} />;
const getCryptoIconSrc = (symbol: string | undefined | null) => {
  // If there is no symbol at all, use the "no icon" themed fallback
  if (!symbol) {
    return NO_ICON_SRC;
  }
  const key = `../../assets/crypto/${symbol.toLowerCase()}.png`;
  const icon = cryptoIcons[key] ? (
    <img src={cryptoIcons[key]} alt={symbol} />
  ) : (
    NO_ICON_SRC
  );
  return icon;
};

const MainPage = () => {
  const user = useUserStore((state) => state.user);
  const toast = useToast();

  const [page, setPage] = useState(DEFAULT_PAGE);

  const setLoading = useAssetStore((state) => state.setLoading);
  const assetList = useAssetStore((state) => state.assetList);
  const setAssetList = useAssetStore((state) => state.setAssetList);

  const { setModalOpen } = useLoginModalStore();

  const { data, isSuccess, refetch, isFetching, isError } = useQuery<
    CryptoCoin[],
    Error
  >({
    queryKey: ['cryptoCoins'],
    queryFn: () => fetchCryptoCoins(page),
  });

  const columns: Column[] = [
    {
      name: 'Icon',
      key: 'image',
      width: TABLE_ICON_WIDTH,
      renderCell: (_, row) => getCryptoIconSrc(String(row.symbol)),
    },
    {
      name: 'Name',
      key: 'name',
      sortable: true,
    },
    {
      name: 'Price (USD)',
      key: 'current_price',
      renderCell: (_, row) =>
        row.current_price?.toLocaleString('en-US', {
          maximumFractionDigits: PRICE_MAX_FRACTION_DIGITS,
        }),
      sortable: true,
    },
    {
      name: '',
      key: 'actions',
      width: TABLE_ACTIONS_WIDTH,
      renderCell: () => (
        <>
          <div title={!user ? 'Please log in' : ''} className={styles.actions}>
            <Dropdown
              disabled={isFetching}
              onBuy={() => handleBuySellAction(Action.BUY)}
              onSell={() => handleBuySellAction(Action.SELL)}
            />
          </div>
        </>
      ),
    },
  ];

  const rowsForTable: TableRow[] = assetList
    ? assetList.map((coin: CryptoCoin) => ({
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol,
        current_price: coin.current_price,
        market_cap: coin.market_cap,
        image: coin.image,
      }))
    : [];

  const fetchMoreItems = async () => {
    setLoading(true);
    await setPage(page + 1);
    await refetch();
    handleThrowError();
    setLoading(false);
  };

  const handleBuySellAction = (action: Action) => {
    if (!user) {
      setModalOpen(true);
      return;
    }

    const actionText = action === Action.BUY ? 'Buy' : 'Sell';
    toast.success(`${actionText} button is clicked`);
  };

  const handleThrowError = () => {
    if (isError) {
      toast.error('Error while fetching data');
    }
  };

  // Set asset list to store if fetching is success
  useEffect(() => {
    if (isSuccess) {
      setAssetList([...assetList, ...data]);
    }
  }, [isSuccess, data, setAssetList]);

  // Show error toast if fetching failed
  useEffect(() => {
    handleThrowError();
  }, [isError]);

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Home</h1>
      <Table columns={columns} rows={rowsForTable} />
      <div className={styles.showMoreBlock}>
        {isFetching ? (
          <Loader />
        ) : (
          <Button onClick={fetchMoreItems}>Show more</Button>
        )}
      </div>
    </div>
  );
};

export default MainPage;
