import { useState, useEffect, type FC } from 'react';
import styles from './Transfer.module.css';
import { useAssetStore } from '../../shared/store/assetStore';
import { type CryptoCoin, fetchCoinList } from '../../shared/api/cryptoApi';
import { useQuery } from '@tanstack/react-query';
import { SwapIcon } from '../../shared/ui/Icons/SwapIcon';
import { useUserStore } from '../../shared/store/userStore';
import { Button } from '../../shared/ui/Button/Button';
import { useToast } from '../../shared/ui/Toast/Toast';

export const Transfer: FC = () => {
  const user = useUserStore((state) => state.user);

  const fullAssetList = useAssetStore((state) => state.fullAssetList);
  const setFullAssetList = useAssetStore((state) => state.setFullAssetList);
  const toast = useToast();

  const [fromAmount, setFromAmount] = useState<number>(1);
  const [fromCurrency, setFromCurrency] = useState<string>('');
  const [toCurrency, setToCurrency] = useState<string>('');
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
  const [isSwapped, setIsSwapped] = useState(false);
  const [exchangeRate, setExchangeRate] = useState<number>(0);

  const { data, isSuccess, isFetching } = useQuery<CryptoCoin[], Error>({
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
    if (Number(fromAmount) < 0) {
      setFromAmount(0);
    }
    const convertedAmount = Number(fromAmount) * exchangeRate;
    setConvertedAmount(convertedAmount);
  }, [fromAmount]);

  useEffect(() => {
    if (fullAssetList.length > 0) {
      if (!fromCurrency) setFromCurrency(fullAssetList[0].id);
      if (!toCurrency && fullAssetList.length > 1)
        setToCurrency(fullAssetList[1].id);
    }
    const fromCoin = fullAssetList.find((coin) => coin.id === fromCurrency);
    const toCoin = fullAssetList.find((coin) => coin.id === toCurrency);
    const exchangeRate =
      (fromCoin?.current_price ?? 0) / (toCoin?.current_price ?? 1);
    setExchangeRate(exchangeRate);
    const convertedAmount = Number(fromAmount) * exchangeRate;
    setConvertedAmount(convertedAmount);
  }, [fullAssetList, fromCurrency, toCurrency]);

  const handleSwap = () => {
    setIsSwapped(!isSwapped);
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setConvertedAmount(null);
  };

  const handleConvert = () => {
    if (
      !fromAmount ||
      Number(fromAmount) <= 0 ||
      !fromCurrency ||
      !toCurrency
    ) {
      toast.error('Please enter a valid amount and select both currencies.');
      return;
    }

    const fromCoin = fullAssetList.find((coin) => coin.id === fromCurrency);
    const toCoin = fullAssetList.find((coin) => coin.id === toCurrency);

    if (fromCoin && toCoin) {
      const result =
        (Number(fromAmount) * fromCoin.current_price) / toCoin.current_price;
      setConvertedAmount(result);

      toast.success(
        `Successfully converted ${fromAmount} ${fromCoin.symbol.toUpperCase()} to ${result.toFixed(6)} ${toCoin.symbol.toUpperCase()}`
      );
    } else {
      toast.error('Selected currencies not found.');
      setConvertedAmount(null);
    }
  };

  const availableCurrencies = (uniqueId: number | string) =>
    fullAssetList.map((coin, index) => (
      <option key={`${uniqueId}-${coin.id}-${index}`} value={coin.id}>
        {coin.name} ({coin.symbol.toUpperCase()})
      </option>
    ));

  return (
    <div className={styles.transferContainer}>
      <h2>Crypto Converter</h2>

      <div className={styles.conversionSection}>
        <label htmlFor="fromAmount">From</label>
        <div className={styles.inputGroup}>
          <select
            id="fromCurrency"
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
            disabled={!fullAssetList.length || isFetching || !user}
          >
            <option value="">Select</option>
            {availableCurrencies('fromCurrency')}
          </select>
          <input
            id="fromAmount"
            type="number"
            value={fromAmount}
            onChange={(e) => setFromAmount(Number(e.target.value))}
            placeholder="Enter amount"
            step="any"
            disabled={isFetching || !user}
          />
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
        <label htmlFor="toCurrency">To</label>
        <div className={styles.inputGroup}>
          <select
            id="toCurrency"
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
            disabled={!fullAssetList.length || isFetching || !user}
          >
            <option value="">Select</option>
            {availableCurrencies('toCurrency')}
          </select>
          <input
            id="toAmount"
            type="text"
            value={
              convertedAmount !== null
                ? convertedAmount.toLocaleString(undefined, {
                    maximumFractionDigits: 6,
                  })
                : ''
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

      {convertedAmount !== null && (
        <p className={styles.result}>
          {fromAmount}{' '}
          {fullAssetList
            .find((c) => c.id === fromCurrency)
            ?.symbol.toUpperCase() || ''}{' '}
          is{' '}
          {convertedAmount.toLocaleString('en-US', {
            maximumFractionDigits: 6,
          })}{' '}
          {fullAssetList
            .find((c) => c.id === toCurrency)
            ?.symbol.toUpperCase() || ''}
        </p>
      )}

      {!user && (
        <p className={styles.disabled}>
          Functionality is disabled. Please, Login to use it
        </p>
      )}
    </div>
  );
};
