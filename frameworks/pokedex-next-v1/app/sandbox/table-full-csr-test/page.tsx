// questa pagina è SSG inizialmente
import TableFull from '@/components/TableFull';

// import dynamic from 'next/dynamic';

// Disabilita SSR per questa pagina
export const dynamic = 'force-dynamic';
export const ssr = false;
export default function TableTestPage() {
  return (
    <>
      <TableFull cols={100} rows={10} />
    </>
  );
}
// Carica il componente solo client-side, senza SSR
// const TableSandbox = dynamic(() => import('@/components/TableFull'), {
//   ssr: false,
//   loading: () => <div className="p-8">Caricamento...</div>,
// });

// export default function TableFullCSRTestPage() {
//   return (
//     <Suspense fallback={<div className="p-8">Caricamento...</div>}>
//       <TableSandbox cols={1000} rows={50} />
//     </Suspense>
//   );
// }