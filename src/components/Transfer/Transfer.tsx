import { useState, useEffect, type FC } from 'react';
import styles from './Transfer.module.css';
import { useAssetStore } from '@/store/assetStore';
import { type CryptoCoin, fetchCoinList } from '@/api/cryptoApi';
import { useQuery } from '@tanstack/react-query';
import { SwapIcon } from '@/components/Icons/SwapIcon';
import { useUserStore } from '@/store/userStore';
import { useToast } from '@/store/useToastStore';
import { Button } from '@/components/Button/Button';
import { Loader } from '@/components/Loader/Loader';
import clsx from 'clsx';
import {
  CONVERSION_FRACTION_DIGITS,
  RATE_FRACTION_DIGITS,
  REFETCH_INTERVAL,
  REFETCH_TIMEOUT,
  TRANSFER_DEFAULT_FROM_AMOUNT,
  TRANSFER_DEFAULT_EXCHANGE_RATE,
  TRANSFER_DEFAULT_REFETCH_TIMEOUT,
} from '@/const';

export const Transfer: FC = () => {
  const user = useUserStore((state) => state.user);

  const fullAssetList = useAssetStore((state) => state.fullAssetList);
  const setFullAssetList = useAssetStore((state) => state.setFullAssetList);
  const toast = useToast();

  const [fromAmount, setFromAmount] = useState<number>(
    TRANSFER_DEFAULT_FROM_AMOUNT
  );
  const [isSwapped, setIsSwapped] = useState(false);
  const [exchangeRate, setExchangeRate] = useState<number>(
    TRANSFER_DEFAULT_EXCHANGE_RATE
  );
  const [currency, setCurrency] = useState('');
  const [refetchTimeout, setRefetchTimeout] = useState(
    TRANSFER_DEFAULT_REFETCH_TIMEOUT
  );

  const availableCurrencies = fullAssetList.map((coin, index) => (
    <option key={`${coin.id}-${index}`} value={coin.id}>
      {coin.name} ({coin.symbol.toUpperCase()})
    </option>
  ));

  const { data, isSuccess, isFetching, isError, refetch } = useQuery<
    CryptoCoin[],
    Error
  >({
    queryKey: ['fullCoinList'],
    queryFn: fetchCoinList,
  });

  const handleSwap = () => {
    setIsSwapped(!isSwapped);
  };

  const handleRefetchTimeout = async () => {
    if (refetchTimeout > 0) return;

    await refetch();

    handleThrowError();
    setRefetchTimeout(REFETCH_TIMEOUT);
  };

  const handleThrowError = () => {
    if (isError) {
      toast.error('Error while fetching data');
    }
  };

  // Setting timeout for refetch availability in case of error
  useEffect(() => {
    if (refetchTimeout === 0) return;

    const timer = setInterval(() => {
      setRefetchTimeout((prev) => prev - 1);
    }, REFETCH_INTERVAL);

    return () => clearInterval(timer);
  }, [refetchTimeout]);

  // Set asset list to store if fetch is success
  useEffect(() => {
    if (isSuccess) {
      setFullAssetList([...fullAssetList, ...data]);
    }
  }, [isSuccess]);

  // Show error toast if fetching failed
  useEffect(() => {
    handleThrowError();
  }, [isError]);

  // From amount cannot be negative
  useEffect(() => {
    if (Number(fromAmount) < 0) {
      setFromAmount(0);
    }
  }, [fromAmount]);

  // Setting first currency as value in dropdown and setting exchange rate
  useEffect(() => {
    if (fullAssetList.length > 0) {
      if (!currency) setCurrency(fullAssetList[0].id);
    }
    const fromCoin = fullAssetList.find((coin) => coin.id === currency);

    const exchangeRate =
      fromCoin?.current_price ?? TRANSFER_DEFAULT_EXCHANGE_RATE;
    setExchangeRate(exchangeRate);
  }, [fullAssetList, currency]);

  if (isFetching) {
    return <LoadingCard />;
  }

  if (isError) {
    return (
      <ErrorCard
        onRefetch={() => handleRefetchTimeout()}
        timeout={refetchTimeout}
      />
    );
  }

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
            className={clsx(styles.input)}
            value={fromAmount}
            onChange={(e) => setFromAmount(Number(e.target.value))}
            placeholder="Enter amount"
            step="any"
            disabled={isFetching || !user}
          />
          {!isSwapped ? (
            <select
              id="fromCurrency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              disabled={!fullAssetList.length || isFetching || !user}
            >
              <option value="">Select</option>
              {availableCurrencies}
            </select>
          ) : (
            <div className={styles.conversionRate}>
              Conversion rate:{' '}
              {isSwapped
                ? (1 / exchangeRate).toLocaleString('en-US', {
                    maximumFractionDigits: CONVERSION_FRACTION_DIGITS,
                  })
                : exchangeRate.toLocaleString('en-US', {
                    maximumFractionDigits: CONVERSION_FRACTION_DIGITS,
                  })}
            </div>
          )}
        </div>
      </div>

      <div className={styles.swapButtonContainer}>
        <button
          disabled={!user}
          className={styles.swapButton}
          onClick={handleSwap}
          title="Swap"
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
            {isSwapped
              ? ((fromAmount ?? 1) * (1 / exchangeRate)).toLocaleString(
                  'en-US',
                  {
                    maximumFractionDigits: RATE_FRACTION_DIGITS,
                  }
                )
              : ((fromAmount ?? 1) * exchangeRate)?.toLocaleString('en-US', {
                  maximumFractionDigits: RATE_FRACTION_DIGITS,
                })}
          </div>

          {!isSwapped ? (
            <div className={styles.conversionRate}>
              Conversion rate:{' '}
              {isSwapped
                ? (1 / exchangeRate).toLocaleString('en-US', {
                    maximumFractionDigits: CONVERSION_FRACTION_DIGITS,
                  })
                : exchangeRate.toLocaleString('en-US', {
                    maximumFractionDigits: CONVERSION_FRACTION_DIGITS,
                  })}
            </div>
          ) : (
            <select
              id="fromCurrency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              disabled={!fullAssetList.length || isFetching || !user}
            >
              <option value="">Select</option>
              {availableCurrencies}
            </select>
          )}
        </div>
      </div>

      {!user && (
        <p className={styles.disabled}>
          Functionality is disabled. Please, Login to use it
        </p>
      )}
    </div>
  );
};

type ErrorCardProps = {
  timeout: number;
  onRefetch: () => void;
};

const ErrorCard: FC<ErrorCardProps> = ({ timeout, onRefetch }) => {
  return (
    <div className={styles.transferContainer}>
      <h2 className={styles.errorHeader}>
        Error occured, while fetching data. You can try to reload by pushing the
        button below.
      </h2>
      <Button disabled={!!timeout} onClick={() => onRefetch()}>
        Reload
      </Button>
      {timeout ? <span>You can try again in {timeout} seconds</span> : ''}
    </div>
  );
};

const LoadingCard: FC = () => {
  return (
    <div className={clsx(styles.transferContainer, styles.loadingContainer)}>
      <h2>Loading</h2>
      <Loader />
    </div>
  );
};
