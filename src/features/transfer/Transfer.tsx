import { useState, useEffect, type FC } from 'react';
import styles from './Transfer.module.css';
import { useStore } from '../../shared/store/useStore';
import { type CryptoCoin, fetchCoinList } from '../../shared/api/cryptoApi';
import { useQuery } from '@tanstack/react-query';

export const Transfer: FC = () => {
  const fullAssetList = useStore((state) => state.fullAssetList);
  const setFullAssetList = useStore((state) => state.setFullAssetList)

  const [fromAmount, setFromAmount] = useState<number | string>('');
  const [fromCurrency, setFromCurrency] = useState<string>('');
  const [toCurrency, setToCurrency] = useState<string>('');
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
  const [isSwapped, setIsSwapped] = useState(false);


  const { data, isSuccess, isFetching } = useQuery<CryptoCoin[], Error>({
    queryKey: ['fullCoinList'],
    queryFn: fetchCoinList,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    console.log('rendered')
  });

  useEffect(() => {
    if (isSuccess) {
      console.log('Success:', data);
      setFullAssetList([...fullAssetList, ...data])
    }
  }, [isSuccess]);

  useEffect(() => {
    if (fullAssetList.length > 0) {
      if (!fromCurrency) setFromCurrency(fullAssetList[0].id);
      if (!toCurrency && fullAssetList.length > 1) setToCurrency(fullAssetList[1].id);
    }
  }, [fullAssetList, fromCurrency, toCurrency]);

  const handleSwap = () => {
    setIsSwapped(!isSwapped);
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setConvertedAmount(null);
  };

  const handleConvert = () => {
    if (!fromAmount || Number(fromAmount) <= 0 || !fromCurrency || !toCurrency) {
      alert('Please enter a valid amount and select both currencies.');
      return;
    }

    const fromCoin = fullAssetList.find(coin => coin.id === fromCurrency);
    const toCoin = fullAssetList.find(coin => coin.id === toCurrency);

    if (fromCoin && toCoin) {
      const result = (Number(fromAmount) * fromCoin.current_price) / toCoin.current_price;
      setConvertedAmount(result);
    } else {
      alert('Selected currencies not found.');
      setConvertedAmount(null);
    }
  };

  const availableCurrencies = (uniqueId: number | string) => fullAssetList.map((coin, index) => (
    <option key={`${uniqueId}-${coin.id}-${index}`} value={coin.id}>
      {coin.name} ({coin.symbol.toUpperCase()})
    </option>
  ));

  return (
    <div className={styles.transferContainer}>
      <h2>Crypto Converter</h2>

      <div className={styles.conversionSection}>
        <label htmlFor="fromAmount">Amount</label>
        <div className={styles.inputGroup}>
          <input
            id="fromAmount"
            type="number"
            value={fromAmount}
            onChange={e => setFromAmount(Number(e.target.value))}
            placeholder="Enter amount"
            step="any"
            disabled={isFetching}
          />
          <select
            id='fromCurrency'
            value={fromCurrency}
            onChange={e => setFromCurrency(e.target.value)}
            disabled={!fullAssetList.length || isFetching}
          >
            <option value="">Select</option>
            {availableCurrencies('fromCurrency')}
          </select>
        </div>
      </div>

      <div className={styles.swapButtonContainer}>
        <button className={styles.swapButton} onClick={handleSwap}>
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M6.25 15.75l-3.5-3.5 3.5-3.5M2.75 12h17.5M17.75 8.25l3.5 3.5-3.5 3.5"></path>
          </svg>
        </button>
      </div>

      <div className={styles.conversionSection}>
        <label htmlFor="toCurrency">To</label>
        <div className={styles.inputGroup}>
          <input
            id="toAmount"
            type="text"
            value={convertedAmount !== null ? convertedAmount.toLocaleString(undefined, { maximumFractionDigits: 6 }) : ''}
            readOnly
            placeholder="Converted amount"
            disabled={isFetching}
          />
          <select
            id='toCurrency'
            value={toCurrency}
            onChange={e => setToCurrency(e.target.value)}
            disabled={!fullAssetList.length || isFetching}
          >
            <option value="">Select</option>
            {availableCurrencies('toCurrency')}
          </select>
        </div>
      </div>

      <button className={styles.convertButton} onClick={handleConvert}>
        Convert
      </button>

      {convertedAmount !== null && (
        <p className={styles.result}>
          {fromAmount} {fullAssetList.find(c => c.id === fromCurrency)?.symbol.toUpperCase() || ''} is{' '}
          {convertedAmount.toLocaleString(undefined, { maximumFractionDigits: 6 })}{' '}
          {fullAssetList.find(c => c.id === toCurrency)?.symbol.toUpperCase() || ''}
        </p>
      )}
    </div>
  );
}; 