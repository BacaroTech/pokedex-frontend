"use client";
import TableFullActions from '@/components/TableFullActions';

// Disabilita SSR per questa pagina
export const dynamic = 'force-dynamic';
export const ssr = false;
export default function TableTestPage() {
  return (
    <>
      <TableFullActions cols={20} rows={1000} />
    </>
  );
}
