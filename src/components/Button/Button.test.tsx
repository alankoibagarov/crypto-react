import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  it('renders with default props', () => {
    render(<Button>Click Me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<Button onClick={handleClick}>Click Me</Button>);
    const button = screen.getByRole('button');
    await user.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies correct variant class', () => {
    render(<Button variant="success">Save</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toMatch(/success/);
  });

  it('applies "active" class when active prop is true', () => {
    render(<Button active>Active Button</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toMatch(/active/);
  });

  it('supports additional className', () => {
    render(<Button className="extra-class">Styled</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toMatch(/extra-class/);
  });
});
