<script lang="ts">
  import "../app.css";
  import favicon from "$lib/assets/favicon.svg";

  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<div
  class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white"
>
  <!-- Header -->
  <div
    class="border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm sticky top-0 z-10"
  >
    <div class="max-w-7xl mx-auto px-6 py-6">
      <div class="flex items-center gap-3 mb-2">
        <div class="text-3xl">⚡</div>
        <h1 class="text-3xl font-bold">Pokedex Benchmark Suite</h1>
      </div>
      <p class="text-slate-400">
        Svelte - Performance Comparison
      </p>
    </div>
  </div>
    <div class="max-w-7xl mx-auto px-6 py-12">



  {@render children?.()}
      </div>
</div>
