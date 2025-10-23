<script lang="ts">
  import { generateTestData } from "$lib/utils/table-sandbox";
  import type { TableRow } from "$lib/utils/type.table-sandbox";

  const { tableData, colHeaders }: {tableData: TableRow[], colHeaders: string[]} = $props()

   let _tableData: TableRow[] = $state([...tableData]);

  function swapRowsWithCloneArray(): void {
    console.time("Svelte Swap Time");

    if (_tableData.length < 20) {
      setTimeout(() => {
        console.timeEnd("Svelte Swap Time");
      }, 0);
      return;
    }

    const newData = [..._tableData];
    for (let i = 0; i < 10; i++) {
      const endIndex = newData.length - 1 - i;      
      const temp = newData[i];
      newData[i] = newData[endIndex];
      newData[endIndex] = temp;
    }
    _tableData = newData;
     
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
    Test per creare una tabella con {tableData.length} righe e {colHeaders.length} colonne.
  </p>
  <div class="flex space-x-2 mb-4">
    <button
      id="swap"
      onclick={swapRowsWithCloneArray}
      class="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300"
    >
      Swap
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
          {#if _tableData.length > 0}
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
        {#each _tableData as row (row.id)}
          <tr>
            <td
              class="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900"
              >{row.id + 1}</td
            >
            {#each Array.from({ length: colHeaders.length }) as _, i}
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