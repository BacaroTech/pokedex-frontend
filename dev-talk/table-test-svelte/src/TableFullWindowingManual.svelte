<script lang="ts">
  import { onMount } from "svelte";
  import { generateTestData } from "./table-sandbox";
  import type { TableRow } from "./type.table-sandbox";

  const { cols = 1000, rows = 10 } = $props();

  let tableData: TableRow[] = $state([]);
  const ROW_COUNT = cols;
  const COL_COUNT = rows;

  // --- Logica della virtualizzazione manuale ---
  const ROW_HEIGHT = 44; // Altezza fissa di ogni riga in px
  const CONTAINER_HEIGHT = 600; // Altezza del nostro viewport

  let scrollTop = $state(0); // Teniamo traccia della posizione dello scroll

  // Calcoliamo quali indici mostrare
  let startIndex = $derived(Math.floor(scrollTop / ROW_HEIGHT));
  let endIndex = $derived(
    Math.min(
      tableData.length - 1,
      startIndex + Math.ceil(CONTAINER_HEIGHT / ROW_HEIGHT) + 5 // +5 di overscan
    )
  );

  // Creiamo l'array con solo gli elementi visibili
  let visibleRows = $derived(tableData.slice(startIndex, endIndex + 1));

  // Calcoliamo lo spazio vuoto da mettere sopra gli elementi visibili
  let paddingTop = $derived(startIndex * ROW_HEIGHT);

  function handleScroll(event: Event) {
    
    const target = event.target as HTMLElement;
    scrollTop = target.scrollTop;
    console.debug("handlescroll " + scrollTop)
  }

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
  });

  
</script>

<div class="w-full">
  <h1 class="text-2xl font-bold mb-4">
    Svelte 5 Performance Test (TypeScript)
  </h1>
  <p class="mb-4">
    Test per creare una tabella con {ROW_COUNT} righe e {COL_COUNT} colonne.
  </p>

  <div class=" overflow-x-auto border border-gray-200 rounded-lg">
    <div
      class="relative overflow-auto border rounded-lg"
      style="height: {CONTAINER_HEIGHT}px;"
      id="virtual-scroll-container"
      onscroll={handleScroll}
    >
      <table
        class="min-w-full"
        style="position: absolute; top: {paddingTop}px; width: 100%;"
      >
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
        <tbody>
          {#each visibleRows as row (row.id)}
            <tr style="height: {ROW_HEIGHT}px;" class="{row.id !== 0 && row.id % 20 === 0 ? 'bg-amber-900' : ''}">
              <td >{row.id + 1}</td>
              {#each Array.from({ length: COL_COUNT }) as _, i}
                <td >{row["field" + i]}</td>
              {/each}
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</div>
