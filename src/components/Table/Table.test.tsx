import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Table, type Column, type TableRow } from './Table';

describe('Table component', () => {
  const columns: Column[] = [
    { name: 'Name', key: 'name', sortable: true },
    { name: 'Age', key: 'age', sortable: true },
    { name: 'Active', key: 'active', sortable: false },
  ];

  const rows: TableRow[] = [
    { name: 'Alice', age: 30, active: true },
    { name: 'Bob', age: 25, active: false },
    { name: 'Charlie', age: 35, active: true },
  ];

  it('renders column headers', () => {
    render(<Table columns={columns} rows={rows} />);

    columns.forEach((col) => {
      expect(screen.getByText(col.name)).toBeInTheDocument();
    });
  });

  it('renders all table rows and cells', () => {
    render(<Table columns={columns} rows={rows} />);

    rows.forEach((row) => {
      expect(screen.getByText(row.name as string)).toBeInTheDocument();
      expect(screen.getByText(String(row.age))).toBeInTheDocument();
    });
  });

  it('sorts by column ASC then DESC when clicked', async () => {
    const user = userEvent.setup();
    render(<Table columns={columns} rows={rows} />);

    const nameHeader = screen.getByText('Name');

    await user.click(nameHeader);
    const firstCellAsc = screen.getAllByRole('row')[1].children[0];
    expect(firstCellAsc.textContent).toBe('Alice');

    await user.click(nameHeader);
    const firstCellDesc = screen.getAllByRole('row')[1].children[0];
    expect(firstCellDesc.textContent).toBe('Charlie');
  });

  it('does not sort when clicking non-sortable column', async () => {
    const user = userEvent.setup();
    render(<Table columns={columns} rows={rows} />);

    const activeHeader = screen.getByText('Active');
    const initialFirstCell =
      screen.getAllByRole('row')[1].children[0].textContent;

    await user.click(activeHeader);
    const afterClickFirstCell =
      screen.getAllByRole('row')[1].children[0].textContent;

    expect(afterClickFirstCell).toBe(initialFirstCell);
  });

  it('uses custom renderCell if provided', () => {
    const customColumns: Column[] = [
      {
        name: 'Name',
        key: 'name',
        sortable: false,
        renderCell: (value) => <span data-testid="custom-cell">{value}</span>,
      },
    ];

    render(<Table columns={customColumns} rows={[{ name: 'Custom' }]} />);
    expect(screen.getByTestId('custom-cell')).toHaveTextContent('Custom');
  });
});
