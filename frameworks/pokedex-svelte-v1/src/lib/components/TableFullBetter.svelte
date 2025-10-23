<script lang="ts">
  import { generateTestData } from "$lib/utils/table-sandbox";
  import type { TableRow } from "$lib/utils/type.table-sandbox";
  import { onMount } from "svelte";
  

  // --- Parametri di configurazione ---
  const { cols = 20, rows = 1000 } = $props();
  const ROW_COUNT = rows;
  const COL_COUNT = cols;
  // Dimensione del chunk: quante righe rendere ad ogni iterazione
  const CHUNK_SIZE = 50;
  // Ritardo tra un chunk e l'altro in millisecondi (0 ms è comunque asincrono)
  const DELAY_MS = 0;
  // --- Fine Parametri di configurazione ---

  // Dati completi (generati una volta)
  const fullTableData: TableRow[] = generateTestData(ROW_COUNT, COL_COUNT);

  // Dati attualmente renderizzati (inizialmente vuoti)
  let tableData: TableRow[] = $state([]);
  // Stato per tenere traccia del chunk corrente
  let currentChunkIndex: number = $state(0);

  // --- Logica di Rendering a Chunk ---

  /**
   * Renderizza il successivo chunk di dati.
   */
  function renderNextChunk() {
    // Calcola l'indice di inizio e fine per il prossimo blocco di dati
    const startIndex = currentChunkIndex * CHUNK_SIZE;
    const endIndex = Math.min(startIndex + CHUNK_SIZE, fullTableData.length);

    if (startIndex < fullTableData.length) {
      // Estrai il chunk di dati
      const nextChunk = fullTableData.slice(startIndex, endIndex);

      // Aggiungi il chunk ai dati renderizzati in modo reattivo
      // Svelte è ottimizzato per le mutazioni di array, ma qui creiamo un nuovo array per chiarezza e per i segnali.
      tableData = [...tableData, ...nextChunk];

      // Passa al prossimo chunk
      currentChunkIndex += 1;

      // Pianifica la prossima iterazione
      // setTimeout(0) sposta l'esecuzione alla fine della coda degli eventi,
      // permettendo al browser di aggiornare l'interfaccia utente tra un chunk e l'altro.
      setTimeout(renderNextChunk, DELAY_MS);
    } else {
      console.log(`Rendering completato di ${tableData.length} righe.`);
      // Puoi aggiungere qui la logica di completamento, es. nascondere un loader
      // performance.mark('rendering-end');
      // console.log("Time Sliced Rendering Time:", performance.measure('rendering-start', 'rendering-end'));
    }
  }

  function createRowsWithChunking() {
    tableData = [];
    currentChunkIndex = 0;

    // Avvia la catena di rendering asincrono
    renderNextChunk();
  }

  function clearRows() {
    tableData = [];
    currentChunkIndex = 0;
  }

  // Rimuovi o adatta le funzioni `createRows`, `swapRowsWithCloneArray`, `swapRows` se non più necessarie.
  // ... (mantieni la logica per `colHeaders` e `colIndexes` se utile)
  function createRows() {
    createRowsWithChunking();
  }

  function swapRowsWithCloneArray(): void {
    console.time("Svelte Swap Time");

    if (tableData.length < 20) {
      setTimeout(() => {
        console.timeEnd("Svelte Swap Time");
      }, 0);
      return;
    }

    const newData = [...tableData]; // Crea una copia per l'immutabilità
    for (let i = 0; i < 10; i++) {
      const endIndex = newData.length - 1 - i;
      // Scambia il primo con l'ultimo, il secondo con il penultimo, etc.
      const temp = newData[i];
      newData[i] = newData[endIndex];
      newData[endIndex] = temp;
    }
    tableData = newData; // Restituisce il nuovo stato per aggiornare il segnale

    setTimeout(() => {
      console.timeEnd("Svelte Swap Time");
    }, 0);
  }

  function swapRows(): void {
    console.time("Svelte Swap Time");
    for (let i = 0; i < 10; i++) {
      const endIndex = tableData.length - 1 - i;
      const temp = tableData[i];
      tableData[i] = tableData[endIndex];
      tableData[endIndex] = temp;
    }
    setTimeout(() => {
      console.timeEnd("Svelte Swap Time");
    }, 0);
  }
  // Calcoliamo le intestazi
  // oni solo una volta se ci sono dati
  let colHeaders: string[] = $derived(
    tableData.length > 0
      ? Array.from({ length: COL_COUNT }, (_, i) => `Campo ${i + 1}`)
      : []
  );
  let colIndexes = $derived(Array.from({ length: COL_COUNT }, (_, i) => i));

  // Avvia il rendering a chunk all'avvio del componente
  onMount(() => {
    createRowsWithChunking();
  });
</script>

<div class="p-8 font-sans">
  <h1 class="text-2xl font-bold mb-4">
    Svelte 5 Performance Test (TypeScript)
  </h1>
  <p class="mb-4">
    Test per creare una tabella con {ROW_COUNT} righe e {COL_COUNT} colonne.
  </p>
  <div class="flex space-x-2 mb-4">
    <button
      id="create"
      onclick={createRows}
      class="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
    >
      Crea {ROW_COUNT} Righe
    </button>
    <button
      onclick={clearRows}
      class="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300"
    >
      Pulisci Tabella
    </button>
    <button
      id="swap"
      onclick={swapRows}
      class="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300"
      >Swap</button
    >
    <button
      id="swapCloneArray"
      onclick={swapRowsWithCloneArray}
      class="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300"
    >
      Swap(Copy)
    </button>
  </div>

  <div class="overflow-x-auto border border-gray-200 rounded-lg">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th
            class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >ID</th
          >
          {#if tableData.length > 0}
            {#each colHeaders as header}
              <th
                class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {header}
              </th>
            {/each}
          {/if}
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        {#each tableData as row (row.id)}
          <tr>
            <td
              class="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900"
              >{row.id + 1}</td
            >
            {#each colIndexes as i}
              <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                {row["field" + i]}
              </td>
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
