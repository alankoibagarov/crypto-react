import axios from 'axios';

const cryptoApi = axios.create({
  baseURL: 'https://api.coingecko.com/api/v3',
});

export interface CryptoCoin {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  market_cap: number;
  image: string;
}

export const fetchCryptoCoins = async (page: number = 1): Promise<CryptoCoin[]> => {
  const response = await cryptoApi.get('/coins/markets', {
    headers: {
        'x-cg-demo-api-key': 'CG-dtBxjoHCDo6dZAhrqrUK3tm2'
    },
    params: {
      vs_currency: 'usd',
      order: 'market_cap_desc',
      per_page: 10,
      page,
      sparkline: false,
    },
  });
  return response.data;
}; 