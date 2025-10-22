import Card from '@/components/Card';

export default function Sandbox() {
  return (
    <>
    <Card href="/sandbox/table-full-csr-test" title="Tabella CSR" description="Go To Tabella CSR" />
    <Card href="/sandbox/table-full-ssr-test" title="Tabella SSR" description="Go To Tabella SSR" />
    <Card href="/sandbox/table-full-ssg-test" title="Tabella SSG" description="Go To Tabella SSG" />
    </>
  );
}
