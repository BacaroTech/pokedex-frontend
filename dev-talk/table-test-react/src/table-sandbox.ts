import type { TableRow } from './type.table-sandbox';

export const generateTestData = (rowCount: number, colCount: number): TableRow[] => {
    const data = [];
    for (let i = 0; i < rowCount; i++) {
        const row: TableRow = { id: i };
        for (let j = 0; j < colCount; j++) {
            row[`field${j}`] = `Riga ${i + 1}, Cella ${j + 1}`;
        }
        data.push(row);
    }
    return data;
};