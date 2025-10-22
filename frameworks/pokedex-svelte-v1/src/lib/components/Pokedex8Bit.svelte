<script lang="ts">
  import { onMount } from "svelte";

  interface PokemonStat {
    base_stat: number;
    stat: {
      name: string;
    };
  }

  interface Pokemon {
    id: number;
    name: string;
    types: string[];
    sprite: string;
    height: number;
    weight: number;
    stats: PokemonStat[];
  }

  type TypeColors = {
    [key: string]: string;
  };

  let pokemon = $state([] as Pokemon[]);
  let loading = $state(true);
  let searchTerm = $state("");
  let selectedPokemon: Pokemon | null = $state(null);
  let filteredPokemon = $derived.by(() => {
    const term = searchTerm.toLowerCase();
    return pokemon.filter(
      (p) =>
        p.name.toLowerCase().includes(term) || p.id.toString().includes(term)
    );
  });

  const formatId = (id: number) => {
    return String(id).padStart(3, "0");
  };

  const fetchPokemon = async (): Promise<void> => {
    try {

     const responseLocal = await fetch('/api/pokemon');
      const dataLocal = await responseLocal.json();
      pokemon = dataLocal;
      pokemon = dataLocal;
    } catch (error) {
      console.error("Error fetching Pokemon:", error);
    } finally {
      loading = false;
    }
  };

  const getTypeColor = (type: string): string => {
    const colors: TypeColors = {
      normal: "#A8A878",
      fire: "#F08030",
      water: "#6890F0",
      electric: "#F8D030",
      grass: "#78C850",
      ice: "#98D8D8",
      fighting: "#C03028",
      poison: "#A040A0",
      ground: "#E0C068",
      flying: "#A890F0",
      psychic: "#F85888",
      bug: "#A8B820",
      rock: "#B8A038",
      ghost: "#705898",
      dragon: "#7038F8",
      dark: "#705848",
      steel: "#B8B8D0",
      fairy: "#EE99AC",
    };
    return colors[type] || "#68A090";
  };
  onMount(() => {
    fetchPokemon();
  });
</script>

{#if loading}
  <div class="min-h-screen bg-black flex items-center justify-center">
    <div class="text-white text-2xl" style="font-family: monospace;">
      LOADING...
    </div>
  </div>
{:else if selectedPokemon}
  <div
    class="min-h-screen bg-black text-white p-4"
    style="font-family: monospace;"
  ></div>
{:else}
  <div
    class="min-h-screen bg-black text-white p-4"
    style="font-family: monospace;"
  >
    <div class="max-w-6xl mx-auto">
      <div class="text-center mb-8">
        <h1 class="text-4xl text-green-400 mb-2">POKÉDEX</h1>
        <div class="text-gray-500 text-sm">Generation I</div>
      </div>

      <div class="mb-6">
        <div class="relative max-w-md mx-auto">
          <div class="absolute left-3 top-1/2 -translate-y-1/2">
            <!-- Icona SVG per Search -->
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              ><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg
            >
          </div>
          <input
            type="text"
            placeholder="SEARCH BY NAME OR NUMBER..."
            bind:value={searchTerm}
            class="w-full bg-gray-900 border-2 border-green-400 text-white px-10 py-2 text-sm focus:outline-none focus:border-green-300"
          />
          {#if searchTerm}
            <button
              onclick={() => (searchTerm = "")}
              aria-label="clear"
              class="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                ><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg
              >
            </button>
          {/if}
        </div>
      </div>
      <div
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
      >
        {#each filteredPokemon as p (p.id)}
          <button
            onclick={() => (selectedPokemon = p)}
            class="border-2 border-green-400 bg-gray-900 p-4 hover:bg-gray-800 hover:border-green-300 transition-all"
          >
            <div class="text-green-400 text-xs mb-2">
              #{formatId(p.id)}
            </div>
            <!-- <div class="bg-black p-2 border border-green-400 mb-3 mx-auto inline-flex">
                  <img
                    [ngSrc]="p.sprite"
                    [alt]="p.name"
                    width="80"
                    height="80"
                    style="image-rendering: pixelated; width: auto; height: 80px; object-fit: contain;"
                  />
                </div> -->
            <div class="bg-black p-2 border border-green-400 mb-3 mx-auto">
              <img
                src={p.sprite}
                alt={p.name}
                width="100"
                height="80"
                style="image-rendering: pixelated; width: 100%; height: 80px; object-fit: contain;"
              />
            </div>
            <div class="text-white text-sm uppercase truncate">
              {p.name}
            </div>
            <div class="flex gap-1 mt-2 justify-center">
              {#each p.types as type}
                <div
                  class="w-2 h-2 border border-white"
                  style:backgroundColor={getTypeColor(type)}
                ></div>
              {/each}
            </div>
          </button>
        {/each}
      </div>
    </div>
  </div>
{/if}
