import Card from '@/components/Card';

export default function App() {
  return (
    <>
      <Card href="/pokedex/tabletest" title="Tabella Pokemon" description="Go To Tabella" />
      <Card href="/pokedex/foldertree" title="Folder Pokemon" description="Go To Folder" />
      <Card href="/pokedex/fiftyanimations" title="Animazioni Pokemon" description="Go To Animations" />
      <Card href="/pokedex/realtimes" title="RealTime Pokemon" description="Go To Real Time" />
      <Card href="/pokedex/kpistats" title="Statistiche Pokemon" description="Go To Statistiche" />
    </>
  );
}
