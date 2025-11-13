<script lang="ts">
  let toggle = $state(false);
  const ITEM_COUNT = 10000;

  // Svelte non ha bisogno di una funzione di merge esterna;
  // gestisce il "merge" e l'ottimizzazione internamente.
  function runTest() {
    toggle = !toggle;
  }
</script>

<div class="p-4">
  <h1>Svelte Performance Test (Compiled Baseline)</h1>
  <button 
    onclick={runTest} 
    class="px-4 py-2 bg-blue-500 text-white rounded my-4"
  >
    Trigger Re-render ({ITEM_COUNT} items)
  </button>
  <div class="border h-[400px] overflow-y-scroll">
    {#each Array(ITEM_COUNT) as _, index (index)}
      <div
        class="w-full h-8 border-b text-sm font-mono p-4"
        class:bg-gray-100={index % 2 === 0}
        class:text-red-600={toggle}
        class:p-10={index >= 500}
        class:p-4={index < 500}
      >
        Item #{index + 1} ({toggle ? 'ON' : 'OFF'})
      </div>
    {/each}
  </div>
</div>