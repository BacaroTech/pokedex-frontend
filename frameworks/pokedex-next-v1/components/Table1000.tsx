'use client';

import React, {
  useCallback,
  useState,
} from 'react';

// Definiamo un'interfaccia per la struttura dei dati di una riga
interface TableRow {
  id: number;
  [key: string]: any; // Permette di avere campi dinamici come field0, field1, ecc.
}

// Funzione per generare i dati di test con i tipi aggiunti
const generateTestData = (rowCount: number, colCount: number): TableRow[] => {
  const data: TableRow[] = [];
  for (let i = 0; i < rowCount; i++) {
    const row: TableRow = { id: i };
    for (let j = 0; j < colCount; j++) {
      row[`field${j}`] = `Riga ${i + 1}, Cella ${j + 1}`;
    }
    data.push(row);
  }
  return data;
};

// Il componente principale dell'applicazione React, ora tipizzato
export default function PerformanceTestPage() {
  const [tableData, setTableData] = useState<TableRow[]>([]);
  const ROW_COUNT = 1000;
  const COL_COUNT = 50;

  // useCallback per evitare ricreazioni inutili della funzione
  const createRows = useCallback(() => {
    console.time('React Rendering Time');
    const data = generateTestData(ROW_COUNT, COL_COUNT);
    setTableData(data);
    // Usiamo un piccolo timeout per assicurare che il rendering sia completato
    // prima di registrare il tempo finale.
    setTimeout(() => {
        console.timeEnd('React Rendering Time');
    }, 0);
  }, []);
  
  const clearRows = () => {
      setTableData([]);
  };

  return (
    <div className="p-8 font-sans">
      <h1 className="text-2xl font-bold mb-4">React/Next.js Performance Test (TypeScript)</h1>
      <p className="mb-4">
        Test per creare una tabella con {ROW_COUNT} righe e {COL_COUNT} colonne.
      </p>
      <div className="flex space-x-2 mb-4">
        <button
          onClick={createRows}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Crea {ROW_COUNT} Righe
        </button>
        <button
          onClick={clearRows}
          className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300"
        >
          Pulisci Tabella
        </button>
      </div>

      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              {tableData.length > 0 && Array.from({ length: COL_COUNT }, (_, i) => (
                <th key={i} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Campo {i + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tableData.map(row => (
              <tr key={row.id}>
                <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{row.id + 1}</td>
                {Array.from({ length: COL_COUNT }, (_, i) => (
                  <td key={i} className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                    {row[`field${i}`]}
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
