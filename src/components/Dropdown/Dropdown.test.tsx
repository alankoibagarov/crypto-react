import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Dropdown } from './Dropdown';

describe('Dropdown', () => {
  it('renders the button', () => {
    render(<Dropdown disabled={false} onBuy={() => {}} onSell={() => {}} />);
    expect(
      screen.getByRole('button', { name: /actions/i })
    ).toBeInTheDocument();
  });

  it('opens the dropdown on button click', async () => {
    const user = userEvent.setup();
    render(<Dropdown disabled={false} onBuy={() => {}} onSell={() => {}} />);
    const toggleButton = screen.getByRole('button', { name: /actions/i });

    await user.click(toggleButton);
    expect(screen.getByRole('button', { name: /buy/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sell/i })).toBeInTheDocument();
  });

  it('calls onBuy and closes dropdown', async () => {
    const user = userEvent.setup();
    const onBuy = vi.fn();

    render(<Dropdown disabled={false} onBuy={onBuy} onSell={() => {}} />);
    await user.click(screen.getByRole('button', { name: /actions/i }));
    await user.click(screen.getByRole('button', { name: /buy/i }));

    expect(onBuy).toHaveBeenCalledTimes(1);
    expect(
      screen.queryByRole('button', { name: /buy/i })
    ).not.toBeInTheDocument();
  });

  it('calls onSell and closes dropdown', async () => {
    const user = userEvent.setup();
    const onSell = vi.fn();

    render(<Dropdown disabled={false} onBuy={() => {}} onSell={onSell} />);
    await user.click(screen.getByRole('button', { name: /actions/i }));
    await user.click(screen.getByRole('button', { name: /sell/i }));

    expect(onSell).toHaveBeenCalledTimes(1);
    expect(
      screen.queryByRole('button', { name: /sell/i })
    ).not.toBeInTheDocument();
  });

  it('disables all buttons when disabled = true', async () => {
    render(<Dropdown disabled={true} onBuy={() => {}} onSell={() => {}} />);
    const actionsButton = screen.getByRole('button', { name: /actions/i });

    expect(actionsButton).toBeDisabled();
  });

  it('closes dropdown when clicking outside', async () => {
    const user = userEvent.setup();
    render(
      <>
        <Dropdown disabled={false} onBuy={() => {}} onSell={() => {}} />
        <div data-testid="outside">Outside</div>
      </>
    );

    await user.click(screen.getByRole('button', { name: /actions/i }));
    expect(screen.getByRole('button', { name: /buy/i })).toBeInTheDocument();

    await user.click(screen.getByTestId('outside'));
    expect(
      screen.queryByRole('button', { name: /buy/i })
    ).not.toBeInTheDocument();
  });
});
