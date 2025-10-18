'use client';

import type { TableRow } from '@/lib/utils/type.table-sandbox';

interface TableSandboxPrerenderProps {
  tableData: TableRow[];
  colHeaders: string[];
  colCount: number
}

export default function TableSandboxPrerender({ tableData, colHeaders, colCount }: TableSandboxPrerenderProps) {

  return (
    <div className="p-8 font-sans">
      <h1 className="text-2xl font-bold mb-4">
        React Performance Test (TypeScript)
      </h1>
      <p className="mb-4">
        Test per creare una tabella con  {colCount} righe e {colHeaders.length} colonne.
      </p>


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
                {Array.from({ length: colCount }).map((_, i) => (
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