'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { generateTestData } from './table-sandbox'; // Assicurati che questi import siano corretti
import type { TableRow } from './type.table-sandbox'; // Assicurati che questi import siano corretti

interface VirtualizedTableProps {
  cols?: number;
  rows?: number;
}

export default function VirtualizedTable({ cols = 1000, rows = 10 }: VirtualizedTableProps) {
  // --- Stato (equivalente a $state) ---
  const [tableData, setTableData] = useState<TableRow[]>([]);
  const [scrollTop, setScrollTop] = useState(0);

  // --- Costanti ---
  const ROW_COUNT = cols;
  const COL_COUNT = rows;
  const ROW_HEIGHT = 44; // Altezza fissa di ogni riga in px
  const CONTAINER_HEIGHT = 600; // Altezza del nostro viewport

  // --- Funzioni per manipolare lo stato ---
  const createRows = useCallback(() => {
    const data = generateTestData(ROW_COUNT, COL_COUNT);
    setTableData(data);
  }, [ROW_COUNT, COL_COUNT]);



  // --- Effetto per il montaggio (equivalente a onMount) ---
  useEffect(() => {
    createRows();
  }, [createRows]);

  // --- Valori Derivati (equivalente a $derived) ---
  // Calcoli semplici che possono essere eseguiti ad ogni render
  const startIndex = Math.floor(scrollTop / ROW_HEIGHT);
  const paddingTop = startIndex * ROW_HEIGHT;
  
  // Usiamo useMemo per calcoli più complessi o per evitare di ricalcolare array/oggetti
  const endIndex = useMemo(() => 
    Math.min(
      tableData.length - 1,
      startIndex + Math.ceil(CONTAINER_HEIGHT / ROW_HEIGHT) + 5 // +5 di overscan
    ), 
    [tableData.length, startIndex]
  );

  const visibleRows = useMemo(() => 
    tableData.slice(startIndex, endIndex + 1), 
    [tableData, startIndex, endIndex]
  );
  
  const colHeaders = useMemo(() => 
    tableData.length > 0
      ? Array.from({ length: COL_COUNT }, (_, i) => `Campo ${i + 1}`)
      : [],
    [tableData.length, COL_COUNT]
  );

  // --- Gestore di eventi ---
  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(event.currentTarget.scrollTop);
  };
  
  // Per far funzionare correttamente la scrollbar, creiamo uno "spacer"
  // che occupa l'altezza totale della tabella virtuale.
  const totalHeight = tableData.length * ROW_HEIGHT;

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-4">
        React Performance Test (TypeScript)
      </h1>
      <p className="mb-4">
        Test per creare una tabella con {ROW_COUNT} righe e {COL_COUNT} colonne.
      </p>

      {/* Container con scroll */}
      <div
        className="relative overflow-auto border border-gray-200 rounded-lg"
        style={{ height: `${CONTAINER_HEIGHT}px` }}
        onScroll={handleScroll}
      >
        {/* Questo div serve solo a creare l'altezza totale per la scrollbar */}
        <div style={{ height: `${totalHeight}px`, position: 'relative' }}>
          {/* La tabella è posizionata in modo assoluto e spostata con `top` */}
          <table
            className="min-w-full"
            style={{
              position: 'absolute',
              top: `${paddingTop}px`,
              width: '100%',
            }}
          >
            <thead className="bg-gray-50 sticky top-0"> {/* sticky per mantenere l'header visibile */}
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
            <tbody>
              {visibleRows.map((row) => (
                <tr
                  key={row.id}
                  style={{ height: `${ROW_HEIGHT}px` }}
                  className={row.id !== 0 && row.id % 20 === 0 ? 'bg-amber-900' : ''}
                >
                  <td>{row.id + 1}</td>
                  {Array.from({ length: COL_COUNT }).map((_, i) => (
                    <td key={i}>{row[`field${i}` as keyof TableRow]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}