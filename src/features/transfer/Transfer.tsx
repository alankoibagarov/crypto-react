import { useState, useEffect, type FC } from 'react';
import styles from './Transfer.module.css';
import { useAssetStore } from '../../shared/store/assetStore';
import { type CryptoCoin, fetchCoinList } from '../../shared/api/cryptoApi';
import { useQuery } from '@tanstack/react-query';
import { SwapIcon } from '../../shared/ui/Icons/SwapIcon';
import { useUserStore } from '../../shared/store/userStore';
import { Button } from '../../shared/ui/Button/Button';
import { useToast } from '../../shared/store/useToastStore';

export const Transfer: FC = () => {
  const user = useUserStore((state) => state.user);

  const fullAssetList = useAssetStore((state) => state.fullAssetList);
  const setFullAssetList = useAssetStore((state) => state.setFullAssetList);
  const toast = useToast();

  const [fromAmount, setFromAmount] = useState<number>(1);
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
  const [isSwapped, setIsSwapped] = useState(false);
  const [exchangeRate, setExchangeRate] = useState<number>(0);
  const [currency, setCurrency] = useState('');

  const { data, isSuccess, isFetching, isError } = useQuery<
    CryptoCoin[],
    Error
  >({
    queryKey: ['fullCoinList'],
    queryFn: fetchCoinList,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (isSuccess) {
      console.log('Success:', data);
      setFullAssetList([...fullAssetList, ...data]);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      toast.error('Error while fetching data');
    }
  }, [isError]);

  useEffect(() => {
    if (Number(fromAmount) < 0) {
      setFromAmount(0);
    }
    const convertedAmount = Number(fromAmount) * exchangeRate;
    setConvertedAmount(convertedAmount);
  }, [fromAmount]);

  useEffect(() => {
    if (fullAssetList.length > 0) {
      if (!currency) setCurrency(fullAssetList[0].id);
    }
    const fromCoin = fullAssetList.find((coin) => coin.id === currency);

    const exchangeRate = fromCoin?.current_price ?? 0;
    setExchangeRate(exchangeRate);
    const convertedAmount = Number(fromAmount) * exchangeRate;
    setConvertedAmount(convertedAmount);
  }, [fullAssetList, currency]);

  const handleSwap = () => {
    setIsSwapped(!isSwapped);
  };

  const handleConvert = () => {
    if (!fromAmount || Number(fromAmount) <= 0 || !currency) {
      toast.error('Please enter a valid amount and select currency');
      return;
    }

    const fromCoin = fullAssetList.find((coin) => coin.id === currency);

    if (fromCoin) {
      const result = Number(fromAmount) * fromCoin.current_price;
      setConvertedAmount(result);

      toast.success(
        `Successfully converted ${fromAmount} ${fromCoin.symbol.toUpperCase()} to ${result.toFixed(6)} USD`
      );
    } else {
      toast.error('Selected currencies not found.');
      setConvertedAmount(null);
    }
  };

  const availableCurrencies = fullAssetList.map((coin, index) => (
    <option key={`${coin.id}-${index}`} value={coin.id}>
      {coin.name} ({coin.symbol.toUpperCase()})
    </option>
  ));

  return (
    <div className={styles.transferContainer}>
      <h2>Crypto Converter</h2>

      <div className={styles.conversionSection}>
        <label htmlFor="fromAmount">
          {isSwapped ? 'USD' : 'Cryptocurrency'}
        </label>
        <div className={styles.inputGroup}>
          <input
            id="fromAmount"
            type="number"
            value={fromAmount}
            onChange={(e) => setFromAmount(Number(e.target.value))}
            placeholder="Enter amount"
            step="any"
            disabled={isFetching || !user}
          />
          <select
            id="fromCurrency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            disabled={!fullAssetList.length || isFetching || !user}
          >
            <option value="">Select</option>
            {availableCurrencies}
          </select>
        </div>
      </div>

      <div className={styles.swapButtonContainer}>
        <button
          disabled={!user}
          className={styles.swapButton}
          onClick={handleSwap}
        >
          <SwapIcon />
        </button>
      </div>

      <div className={styles.conversionSection}>
        <label htmlFor="toCurrency">
          {isSwapped ? 'Cryptocurrency' : 'USD'}
        </label>
        <div className={styles.inputGroup}>
          <div className={styles.conversionRate}>
            Conversion rate:{' '}
            {isSwapped
              ? (1 / exchangeRate).toLocaleString('en-US', {
                  maximumFractionDigits: 9,
                })
              : exchangeRate.toLocaleString('en-US', {
                  maximumFractionDigits: 9,
                })}
          </div>
          <input
            id="toAmount"
            type="text"
            value={
              isSwapped
                ? ((convertedAmount ?? 1) / exchangeRate).toLocaleString(
                    'en-US',
                    {
                      maximumFractionDigits: 6,
                    }
                  )
                : convertedAmount?.toLocaleString('en-US', {
                    maximumFractionDigits: 6,
                  })
            }
            readOnly
            placeholder="Converted amount"
            disabled={isFetching || !user}
          />
        </div>
      </div>

      <Button variant={'primary'} disabled={!user} onClick={handleConvert}>
        Convert
      </Button>

      {!user && (
        <p className={styles.disabled}>
          Functionality is disabled. Please, Login to use it
        </p>
      )}
    </div>
  );
};
