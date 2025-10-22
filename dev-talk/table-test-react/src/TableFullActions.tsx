'use client';

import {
  useMemo,
  useState,
} from 'react';

import { generateTestData } from './table-sandbox';
import type { TableRow } from './type.table-sandbox';

interface TableSandboxProps {
  cols?: number;
  rows?: number;
}

export default function TableSandboxActions({ cols = 20, rows = 1000 }: TableSandboxProps) {
  const [tableData, setTableData] = useState<TableRow[]>([]);
  const ROW_COUNT = rows;
  const COL_COUNT = cols;

  const createRows = () => {
        console.time("React Rendering Time");

    const data = generateTestData(ROW_COUNT, COL_COUNT);
    setTableData(data);
       setTimeout(() => {
      console.timeEnd("React Rendering Time");
    }, 0);
  };

  const clearRows = () => {
    setTableData([]);
  };

  const swapRows = () => {
        console.time("React Swap Time");
    
    if (tableData.length < 20) {
      console.timeEnd("React Swap Time");
      return;
    }

    // 1. Crea una copia dello stato attuale per non mutare l'originale.
    const newData = [...tableData];
    
    // 2. Esegui la logica di scambio sulla copia.
    for (let i = 0; i < 10; i++) {
      const endIndex = newData.length - 1 - i;
      const temp = newData[i];
      newData[i] = newData[endIndex];
      newData[endIndex] = temp;
    }

    // 3. Aggiorna lo stato con il nuovo array, scatenando il re-render.
    setTableData(newData);

    console.timeEnd("React Swap Time");
  }
  

  const colHeaders = useMemo(
    () =>
      tableData.length > 0
        ? Array.from({ length: COL_COUNT }, (_, i) => `Campo ${i + 1}`)
        : [],
    [tableData.length, COL_COUNT]
  );

  return (
    <div className="p-8 font-sans">
      
       <h1 className="text-2xl font-bold mb-4">
        React Performance Test (TypeScript)
      </h1>
      <p className="mb-4">
        Test per creare una tabella con {ROW_COUNT} righe e {COL_COUNT} colonne.
      </p>
      <div className="flex space-x-2 mb-4">
        <button
        id="create"
          onClick={createRows}
          className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500">
          Crea {ROW_COUNT} Righe
        </button>
        <button
          onClick={clearRows}
          className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300"
        >
          Pulisci Tabella
        </button>
        <button
        id="swap"
          onClick={swapRows}
          className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300"
        >
          Swap
        </button>
      </div>

      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              {tableData.length > 0 &&
                colHeaders.map((header) => (
                  <th
                    key={header}
                    className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tableData.map((row) => (
              <tr key={row.id}>
                <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                  {row.id + 1}
                </td>
                {Array.from({ length: COL_COUNT }).map((_, i) => (
                  <td
                    key={`${row.id}-${i}`}
                    className="px-4 py-2 whitespace-nowrap text-sm text-gray-700"
                  >
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