<script lang="ts">
  
  import { onMount } from "svelte";
  import { generateTestData } from "./table-sandbox";
  import type { TableRow } from "./type.table-sandbox";

  const {cols = 1000, rows = 10} = $props()

  let tableData: TableRow[] = $state([]);
  const ROW_COUNT = cols;
  const COL_COUNT = rows;

  function createRows() {
    tableData = generateTestData(ROW_COUNT, COL_COUNT);
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
  let colIndexes = $derived(Array.from({ length: COL_COUNT }, (_, i) => i));

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
