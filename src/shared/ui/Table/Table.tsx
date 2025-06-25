import styles from './Table.module.css'

export const Table = ({columns = [], rows = []} : {columns: string[], rows: number[]}) => {

    return (
        <table className={styles.table}>
            <thead>
                <tr>
                    {
                        columns.map((column) => (
                            <th className={styles.th}>{column}</th>
                        )
                    )}
                </tr>
            </thead>
            <tbody>
                <tr>
                    {
                        rows.map((row) => (
                            <td className={styles.td}>{row}</td>
                        ))
                    }
                </tr>
            </tbody>
        </table>
    )
}