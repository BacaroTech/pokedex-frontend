'use client';

import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import { generateTestData } from './table-sandbox';
import type { TableRow } from './type.table-sandbox';

interface TableSandboxProps {
  cols?: number;
  rows?: number;
}

export default function TableSandbox({ cols = 20, rows = 1000 }: TableSandboxProps) {
  const [tableData, setTableData] = useState<TableRow[]>([]);
  const ROW_COUNT = rows;
  const COL_COUNT = cols;

  const createRows = () => {
    const data = generateTestData(ROW_COUNT, COL_COUNT);
    setTableData(data);
  };

  const clearRows = () => {
    setTableData([]);
  };

  const colHeaders = useMemo(
    () =>
      tableData.length > 0
        ? Array.from({ length: COL_COUNT }, (_, i) => `Campo ${i + 1}`)
        : [],
    [tableData.length, COL_COUNT]
  );

  useEffect(() => {
    createRows();
  }, []);

  return (
    <div>
      <h1>
        React Performance Test (TypeScript)
      </h1>
      <p>
        Test per creare una tabella con {ROW_COUNT} righe e {COL_COUNT} colonne.
      </p>
      <div>
        <button onClick={createRows}>
          Crea {ROW_COUNT} Righe
        </button>
        <button onClick={clearRows}>
          Pulisci Tabella
        </button>
      </div>

      <div>
        <table>
          <thead>
            <tr>
              <th>
                ID
              </th>
              {tableData.length > 0 &&
                colHeaders.map((header) => (
                  <th key={header}>
                    {header}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {tableData.map((row) => (
              <tr key={row.id}>
                <td>
                  {row.id + 1}
                </td>
                {Array.from({ length: COL_COUNT }).map((_, i) => (
                  <td key={`${row.id}-${i}`}>
                    {row[`field${i}` as keyof TableRow]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}