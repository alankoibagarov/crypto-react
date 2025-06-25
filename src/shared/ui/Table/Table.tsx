import { Button } from '../Button/Button';
import styles from './Table.module.css'

export interface Column {
    name: string
    key: string
    width?: number
    renderCell?: (value: string | number | boolean | null | undefined, row: TableRow, rowIndex: number, colIndex: number) => React.ReactNode
}

export type TableRow = Record<string, string | number | boolean | null | undefined>;

export const Table = ({columns = [], rows = []} : {columns: Column[], rows: TableRow[]}) => {

    return (
        <table className={styles.table}>
            <thead>
                <tr>
                    {
                        columns.map((column, index) => (
                            <th className={styles.th} key={index} onClick={() => alert('clicked!')}>
                                {column.name}
                            </th>
                        )
                    )}
                </tr>
            </thead>
            <tbody>
                {
                    rows.map((row, index) => (
                        <tr key={index}>
                            {
                                columns.map((column, colIndex) => (
                                    <td className={styles.td}  style={{ width: column.width }}  key={colIndex}>
                                    {  column.renderCell 
                                        ? column.renderCell(row?.[column.key], row, index, colIndex)
                                        : row[column.key]
                                    }
                                    </td>
                                ))
                            }
                        </tr>
                    ))
                }
            </tbody>
        </table>
    )
}