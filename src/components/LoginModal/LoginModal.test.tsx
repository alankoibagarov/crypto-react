import { describe, vi, it, beforeEach, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LoginModal } from './LoginModal';
import { useLoginModalStore } from '@/store/loginModalStore';
import userEvent from '@testing-library/user-event';
import CryptoJS from 'crypto-js';

vi.mock('@/store/loginModalStore', () => ({
  useLoginModalStore: vi.fn(),
}));

vi.mock('@/const/userList.json', () => {
  const key = 'test_key_32_byte_length_str';
  return [
    {
      login: CryptoJS.AES.encrypt('admin@crypto.com', key).toString(),
      password: CryptoJS.AES.encrypt('123456', key).toString(),
    },
  ];
});

vi.stubGlobal('import.meta', {
  env: {
    VITE_ENCRYPTION_KEY: 'test_key_32_byte_length_str',
  },
});

describe('LoginModal', () => {
  const onClose = vi.fn();
  const onLogin = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useLoginModalStore as any).mockReturnValue({
      isModalOpen: true,
      redirectLocation: undefined,
    });
  });

  it('shows error for invalid email format on blur', async () => {
    render(<LoginModal onClose={onClose} onLogin={onLogin} />);
    const emailInput = screen.getByPlaceholderText(/email/i);

    await userEvent.type(emailInput, 'invalid-email');
    fireEvent.blur(emailInput);

    expect(screen.getByText(/wrong email format/i)).toBeInTheDocument();
  });

  it('shows error for empty password on blur', () => {
    render(<LoginModal onClose={onClose} onLogin={onLogin} />);
    const passwordInput = screen.getByPlaceholderText(/password/i);

    fireEvent.blur(passwordInput);
    expect(screen.getByText(/please fill password/i)).toBeInTheDocument();
  });

  it('calls onClose when cancel button is clicked', async () => {
    render(<LoginModal onClose={onClose} onLogin={onLogin} />);
    const cancelBtn = screen.getByRole('button', { name: /cancel/i });

    await userEvent.click(cancelBtn);
    expect(onClose).toHaveBeenCalled();
  });
});
