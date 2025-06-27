import { describe, vi, it, beforeEach, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ToastContainer } from './Toast';
import { useToastStore } from '@/store/useToastStore';

vi.mock('@/store/useToastStore', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/store/useToastStore')>();
  return {
    ...actual,
    useToastStore: vi.fn(),
  };
});

const mockRemoveToast = vi.fn();

const createMockToast = (overrides = {}) => ({
  id: 'toast-1',
  type: 'success',
  message: 'This is a success toast',
  ...overrides,
});

describe('ToastContainer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();

    (useToastStore as any).mockReturnValue({
      toasts: [],
      removeToast: mockRemoveToast,
    });
  });

  it('renders no toasts when the list is empty', () => {
    render(<ToastContainer />);
    expect(screen.queryByText(/toast/i)).not.toBeInTheDocument();
  });

  it('renders a toast message with correct type and message', () => {
    const toast = createMockToast({ type: 'error', message: 'Error occurred' });

    (useToastStore as any).mockReturnValue({
      toasts: [toast],
      removeToast: mockRemoveToast,
    });

    render(<ToastContainer />);
    expect(screen.getByText('Error occurred')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument(); // Close icon
  });

  it('renders different icons based on toast type', () => {
    const types = ['success', 'error', 'warning', 'info'] as const;

    types.forEach((type) => {
      (useToastStore as any).mockReturnValue({
        toasts: [createMockToast({ id: type, type, message: `${type} msg` })],
        removeToast: mockRemoveToast,
      });

      render(<ToastContainer />);
      expect(screen.getByText(`${type} msg`)).toBeInTheDocument();
    });
  });
});
