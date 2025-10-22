import TableSandboxPrerender from '@/components/TableFullPrerender';
import { generateTestData } from '@/lib/utils/table-sandbox';
import type { TableRow } from '@/lib/utils/type.table-sandbox';

const ROW_COUNT = 1000;
const COL_COUNT = 50;

// Genera gli header una sola volta
function generateColHeaders(count: number): string[] {
  return Array.from({ length: count }, (_, i) => `Campo ${i + 1}`);
}

// Per SSG (Static Generation)
export const revalidate = 3600; // Revalidate ogni 1 ora (ISR - Incremental Static Regeneration)

export default function TableTestPage() {
  // Genera i dati server-side
  const tableData: TableRow[] = generateTestData(ROW_COUNT, COL_COUNT);
  const colHeaders: string[] = generateColHeaders(COL_COUNT);

  console.time('Page Generation Time');
  console.timeEnd('Page Generation Time');

  return (
    <div>
      <TableSandboxPrerender
        tableData={tableData}
        colHeaders={colHeaders}
        colCount={COL_COUNT}
      />
    </div>
  );
}