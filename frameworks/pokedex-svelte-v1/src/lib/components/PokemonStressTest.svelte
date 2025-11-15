<script lang="ts">
  import { generateMockPokemon, type MockPokemon } from '$lib/data/mockPokemon';

  // Dati e Conteggio costanti, importati dal modulo TypeScript condiviso
  const ITEM_COUNT = 1000;
  const INITIAL_DATA: MockPokemon[] = generateMockPokemon();
  
  // Reattività Svelte: non servono useState o useCallback
  let pokemonList: MockPokemon[] = INITIAL_DATA;
  let isShiny: boolean = $state(false);
  let isReady: boolean = $state(false);
  let isRunning: boolean = $state(false);
  
  // Svelte: Il codice qui viene eseguito una volta sola (onMount)
  setTimeout(() => isReady = true, 100);

  // Svelte: Forza il re-render di tutti i 1000 elementi
  function runTest() {
    if (isRunning) return;
    isRunning = true;
    
    // Iniziamo a misurare il tempo di rendering
    console.time('Svelte Compiled Rendering Time');
    
    // Invertiamo lo stato per forzare il re-render e la logica condizionale
    isShiny = !isShiny;
    
    // Usiamo un timeout per catturare il tempo dopo che Svelte ha aggiornato il DOM
    // L'aggiornamento avviene nel microtask seguente
    setTimeout(() => {
      console.timeEnd('Svelte Compiled Rendering Time');
      isRunning = false;
    }, 0);
  }

  // --- Funzioni di Utility per lo Styling (non twMerge) ---

  // Funzione che gestisce la logica di conflitto in fase di compilazione
  function getItemTextSize(isHeavy: boolean): string {
      return isHeavy ? 'text-base' : 'text-sm';
  }

  function getItemTextColor(isShiny: boolean): string {
      return isShiny ? 'text-yellow-600' : 'text-gray-900';
  }

  function getItemClass(isHeavy: boolean, isShiny: boolean): string {
      const sizeClass = getItemTextSize(isHeavy);
      const colorClass = getItemTextColor(isShiny);
      return `${sizeClass} ${colorClass}`;
  }
  

</script>

<!-- Utilizziamo Tailwind CSS, quindi lo stile sarà identico alla versione React -->
<div class="p-8 font-sans bg-gray-50 min-h-screen">
  
  {#if !isReady}
    <div class="p-8 text-center text-gray-400">Loading data for stress test...</div>
  {:else}
    <h1 class="text-3xl font-bold mb-2">Pokémon Stress Test (Svelte Compiled)</h1>
    <p class="mb-4 text-gray-600">
      Misura le performance della risoluzione classi **in fase di compilazione**, il baseline da confrontare con l'overhead di `twMerge`.
    </p>

    <div class="flex space-x-2 mb-6">
      <button
        onclick={runTest}
        disabled={isRunning}
        class="px-6 py-3 font-semibold text-white rounded-lg shadow-md transition-all duration-150"
        class:animate-pulse={isRunning}
        class:bg-red-700={isRunning}
        class:bg-blue-600={!isRunning}
        class:hover:bg-blue-700={!isRunning}
        class:focus:ring-4={!isRunning}
        class:focus:ring-blue-300={!isRunning}
      >
        {isRunning ? '...Misurando...' : 'Trigger Rerender (1000 Class Updates)'}
      </button>
      <div class="flex items-center text-sm text-gray-700 border p-3 rounded-lg">
        Stato Attuale: **{isShiny ? 'Shiny Mode' : 'Normal Mode'}**
      </div>
    </div>
    
    <!-- Container per i 1000 elementi -->
    <div class="h-[400px] overflow-y-scroll border border-gray-300 rounded-lg shadow-inner divide-y divide-gray-200">
      {#each pokemonList as p, index (p.id)}
        
        <!-- === LOGICA DI STRESS PER LE CLASSI (1000 esecuzioni) === -->
        <!-- class={getItemTextSize(index > 500)} // CONFLITTO: text-base vs text-sm risolto da JS puro
          class={getItemTextColor(isShiny)} // CONFLITTO: text-yellow-600 vs text-gray-900 risolto da JS puro -->
        <div           
          class:bg-gray-100={index % 2 === 0}
          class:bg-white={index % 2 !== 0}
          
          class:border-r-4={isShiny}
          class:border-yellow-400={isShiny}
          class:border-transparent={!isShiny}

          class="flex items-center py-2 px-4 cursor-pointer {getItemClass(index > 500, isShiny)}"
        >
          <img 
            src={p.sprite} 
            alt={p.name} 
            class="w-8 h-8 mr-4"
            class:grayscale={isShiny}
            style="image-rendering: pixelated;"
          />
          <span class="font-medium truncate">{p.name}</span>
        </div>
      {/each}
    </div>
  {/if}
</div>