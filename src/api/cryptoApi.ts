import { COINS_FOR_EXCHANGE, COINS_PER_PAGE } from '@/const';
import axios from 'axios';

const cryptoApi = axios.create({
  baseURL: import.meta.env.VITE_CRYPTO_API_LINK,
  headers: {
    'x-cg-demo-api-key': import.meta.env.VITE_CRYPTO_API_KEY,
  },
});

export interface CryptoCoin {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  market_cap: number;
  image: string;
}

export interface CoinListItem {
  id: string;
  name: string;
  symbol: string;
}

export const fetchCryptoCoins = async (
  page: number = 1
): Promise<CryptoCoin[]> => {
  const response = await cryptoApi.get('/coins/markets', {
    params: {
      vs_currency: 'usd',
      order: 'market_cap_desc',
      per_page: COINS_PER_PAGE,
      page,
      sparkline: false,
    },
  });
  return response.data;
};

export const fetchCoinList = async (): Promise<CryptoCoin[]> => {
  const response = await cryptoApi.get('/coins/markets', {
    params: {
      vs_currency: 'usd',
      order: 'market_cap_desc',
      per_page: COINS_FOR_EXCHANGE, // fetch only top 100 for exchange
      page: 1,
      sparkline: false,
    },
  });
  return response.data;
};
