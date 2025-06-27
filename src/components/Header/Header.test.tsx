import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Header } from './Header';
import { vi } from 'vitest';
import { MemoryRouter, useNavigate } from 'react-router-dom';

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe('Header', () => {
  const tabs = [
    { label: 'Home', path: '/' },
    { label: 'Trade', path: '/trade' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders logo, title and nav tabs', () => {
    render(
      <MemoryRouter>
        <Header
          tabs={tabs}
          tab={0}
          user={null}
          setLoginOpen={() => {}}
          onLogout={() => {}}
        />
      </MemoryRouter>
    );

    expect(screen.getByAltText(/logo/i)).toBeInTheDocument();
    expect(screen.getByText(/React Crypto App/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Home' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Trade' })).toBeInTheDocument();
  });

  it('calls navigate when nav button is clicked', async () => {
    const user = userEvent.setup();
    const mockNavigate = vi.fn();
    (useNavigate as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      mockNavigate
    );

    render(
      <MemoryRouter>
        <Header
          tabs={tabs}
          tab={0}
          user={null}
          setLoginOpen={() => {}}
          onLogout={() => {}}
        />
      </MemoryRouter>
    );

    await user.click(screen.getByRole('button', { name: 'Trade' }));
    expect(mockNavigate).toHaveBeenCalledWith('/trade');
  });
});
