<script lang="ts">
  import { generateTestData } from "$lib/utils/table-sandbox";
  import type { TableRow } from "$lib/utils/type.table-sandbox";
  import { onMount } from "svelte";

  const { cols = 1000, rows = 10 } = $props();

  let tableData: TableRow[] = $state([]);

  const ROW_COUNT = rows;
  const COL_COUNT = cols;

  let colHeaders: string[] = $derived(
    tableData.length > 0
      ? Array.from({ length: COL_COUNT }, (_, i) => `Campo ${i + 1}`)
      : []
  );
  let colIndexes = $derived(Array.from({ length: COL_COUNT }, (_, i) => i));

  onMount(() => createRows());

  function createRows() {
    console.time("Svelte Rendering Time");
    performance.mark("rendering-start");

    tableData = generateTestData(ROW_COUNT, COL_COUNT);
    setTimeout(() => {
      console.timeEnd("Svelte Rendering Time");
    }, 0);
  }

  function clearRows() {
    tableData = [];
  }

  function swapRowsWithCloneArray(): void {
    console.time("Svelte Swap Time");

    if (tableData.length < 20) {
      setTimeout(() => {
        console.timeEnd("Svelte Swap Time");
      }, 0);
      return;
    }

    const newData = [...tableData];
    for (let i = 0; i < 10; i++) {
      const endIndex = newData.length - 1 - i;
      const temp = newData[i];
      newData[i] = newData[endIndex];
      newData[endIndex] = temp;
    }
    tableData = newData;
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
      Swap + Push
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
