<script lang="ts">
  import { onMount } from "svelte";

  // Definiamo un'interfaccia per la struttura dei dati di una riga
  interface TableRow {
    id: number;
    [key: string]: any; // Permette di avere campi dinamici come field0, field1, ecc.
  }

  let tableData: TableRow[] = $state([]);
  const ROW_COUNT = 1000;
  const COL_COUNT = 50;

  // Funzione per generare i dati di test con i tipi aggiunti
  const generateTestData = (rowCount: number, colCount: number): TableRow[] => {
    const data = [];
    for (let i = 0; i < rowCount; i++) {
      const row: any = { id: i };
      for (let j = 0; j < colCount; j++) {
        row[`field${j}`] = `Riga ${i + 1}, Cella ${j + 1}`;
      }
      data.push(row);
    }
    return data;
  };

  function createRows() {
    console.time("Svelte Rendering Time");
    tableData = generateTestData(ROW_COUNT, COL_COUNT);

    // Con Svelte, il DOM viene aggiornato in modo sincrono all'interno del microtask.
    // Il tempo può essere misurato in modo più diretto.
    // Aggiungiamo un timeout per coerenza con gli altri framework.
    setTimeout(() => {
      console.timeEnd("Svelte Rendering Time");
    }, 0);
  }

  function clearRows() {
    tableData = [];
  }

  // Calcoliamo le intestazioni solo una volta se ci sono dati
  let colHeaders: string[] = $derived(
    tableData.length > 0
      ? Array.from({ length: COL_COUNT }, (_, i) => `Campo ${i + 1}`)
      : []
  );

  onMount(() => {
    createRows();
  })
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
            {#each Array.from({ length: COL_COUNT }) as _, i}
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
