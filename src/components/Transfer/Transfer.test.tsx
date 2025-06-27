import { render, screen } from '@testing-library/react';
import { Transfer } from './Transfer';
import { vi } from 'vitest';
import { useQuery } from '@tanstack/react-query';

// 🧪 Mocks
vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual('@tanstack/react-query');
  return {
    ...actual,
    useQuery: vi.fn(),
  };
});

vi.mock('@/store/userStore', () => ({
  useUserStore: () => ({ user: { id: 1, name: 'Test User' } }),
}));

vi.mock('@/store/assetStore', () => ({
  useAssetStore: vi.fn((cb) =>
    cb({
      fullAssetList: [
        { id: 'bitcoin', name: 'Bitcoin', symbol: 'btc', current_price: 50000 },
      ],
      setFullAssetList: vi.fn(),
    })
  ),
}));

vi.mock('@/store/useToastStore', () => ({
  useToast: () => ({
    error: vi.fn(),
  }),
}));

// 🧪 Tests
describe('Transfer', () => {
  it('shows loading screen when isFetching is true', () => {
    (useQuery as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      isFetching: true,
      isError: false,
      isSuccess: false,
      data: [],
      refetch: vi.fn(),
    });

    render(<Transfer />);
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it('shows error card when isError is true', () => {
    (useQuery as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      isFetching: false,
      isError: true,
      isSuccess: false,
      data: [],
      refetch: vi.fn(),
    });

    render(<Transfer />);
    expect(
      screen.getByText(/Error occured, while fetching data/i)
    ).toBeInTheDocument();
  });

  it('renders crypto converter with valid data', async () => {
    (useQuery as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      isFetching: false,
      isError: false,
      isSuccess: true,
      data: [
        { id: 'bitcoin', name: 'Bitcoin', symbol: 'btc', current_price: 50000 },
      ],
      refetch: vi.fn(),
    });

    render(<Transfer />);

    expect(await screen.findByText('Crypto Converter')).toBeInTheDocument();
    expect(screen.getByLabelText(/Cryptocurrency/i)).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toHaveValue('bitcoin');
    expect(screen.getByText(/Conversion rate/i)).toBeInTheDocument();
  });
});
