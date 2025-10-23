<script lang="ts">
  import type { IdGradient, TestCase } from '$lib/type';
  import { onMount } from 'svelte';

  
  let selectedTest: TestCase | null = $state(null);
  let tests: TestCase[] = $state([
    {
      id: 1,
      title: 'Tabella 10k Items',
      description: 'Render di una lista di 10,000 Pokémon con ricerca real-time',
      icon: '📊',
      metrics: ['LCP', 'INP', 'CLS', 'Render Time'],
      complexity: 'Medio',
      path: '/app/tabletest',
      details: 'Test di base: misura come i tre framework gestiscono una grande lista'
    },
    {
      id: 2,
      title: 'Albero di Componenti 500+ Nodi',
      description: 'Struttura gerarchica profonda con expand/collapse',
      icon: '🌳',
      metrics: ['DOM Nodes', 'Memory', 'Re-render Count'],
      complexity: 'Alto',
      path: '/app/foldertree',
      details: 'Test di state management: come gestiscono componenti annidati'
    },
    {
      id: 3,
      title: '50 Animazioni Simultanee',
      description: 'Card animate con transizioni fluide e choreography',
      icon: '🎬',
      metrics: ['FPS', 'CPU Usage', 'INP'],
      complexity: 'Molto Alto',
      path: '/app/fiftyanimations',
      details: 'Test di performance: come gestiscono rendering animato'
    },
    {
      id: 4,
      title: 'Real-time Updates (In Pausa)',
      description: 'Aggiornamenti continui con polling/WebSocket',
      icon: '🔄',
      metrics: ['Frame Drops', 'Memory Leak', 'TTI'],
      complexity: 'Massimo',
      path: '/app/realtimes',
      disabled: true,
      details: 'Test di reattività: aggiornamenti in tempo reale'
    },
    {
      id: 5,
      title: 'Complex Card con Micro-grafico',
      description: 'Card ricca con statistiche visualizzate',
      icon: '📈',
      metrics: ['TTI', 'CLS', 'Render Time'],
      complexity: 'Alto',
      path: '/app/kpistats',
      details: 'Test di componenti complessi: rendering con dati dinamici'
    }
  ]);

  function closeModal() {
    selectedTest = null;
  }

  function getComplexityColor(complexity: 'Medio' | 'Alto' | 'Molto Alto' | 'Massimo') {
    const colors = {
      'Medio': 'bg-yellow-500/20 text-yellow-300',
      'Alto': 'bg-orange-500/20 text-orange-300',
      'Molto Alto': 'bg-red-500/20 text-red-300',
      'Massimo': 'bg-gray-500/20 text-gray-300'
    };
    return colors[complexity] || 'bg-gray-500/20 text-gray-300';
  }

  function getGradientClass(id: number) {
    const gradients = {
      1: 'from-blue-500 to-blue-600',
      2: 'from-green-500 to-green-600',
      3: 'from-purple-500 to-purple-600',
      4: 'from-yellow-500 to-yellow-600',
      5: 'from-red-500 to-red-600'
    };
    const _modId = ((id < 1 || id > 5) ? 5 : id) as (IdGradient);
    return gradients[_modId] || 'from-slate-500 to-slate-600';
  }
</script>

<div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
  <!-- Header -->
  <div class="border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm sticky top-0 z-10">
    <div class="max-w-7xl mx-auto px-6 py-6">
      <div class="flex items-center gap-3 mb-2">
        <div class="text-3xl">⚡</div>
        <h1 class="text-3xl font-bold">Pokedex Benchmark Suite</h1>
      </div>
      <p class="text-slate-400">React vs Svelte vs Angular - Performance Comparison</p>
    </div>
  </div>

  <!-- Main Content -->
  <div class="max-w-7xl mx-auto px-6 py-12">
    <!-- Intro Section -->
    <div class="mb-12">
      <div class="bg-slate-700/30 border border-slate-600/50 rounded-lg p-8 backdrop-blur-sm">
        <h2 class="text-2xl font-bold mb-4 flex items-center gap-2">
          📊 Come funziona
        </h2>
        <p class="text-slate-300 leading-relaxed">
          Seleziona uno dei 5 test di performance per misurare come React, Svelte e Angular affrontano scenari sempre più complessi. 
          Ogni test include Lighthouse per le metriche web e Playwright per l'automazione.
        </p>
      </div>
    </div>

    <!-- Tests Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
      {#each tests as test (test.id)}
        <div
          class={`group relative overflow-hidden rounded-lg transition-all duration-300 ${
            test.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 hover:shadow-2xl cursor-pointer'
          }`}
          onclick={() => !test.disabled && (selectedTest = test)}
          role={test.disabled ? 'presentation' : 'button'}
          tabindex={test.disabled ? -1 : 0}
          onkeydown={(e) => {
            if (!test.disabled && (e.key === 'Enter' || e.key === ' ')) {
              selectedTest = test;
            }
          }}
        >
          <!-- Background Gradient -->
          <div class={`absolute inset-0 bg-gradient-to-br ${getGradientClass(test.id)} opacity-20`}></div>
          <div class={`absolute inset-0 bg-gradient-to-br ${getGradientClass(test.id)} opacity-0 group-hover:opacity-30 transition-opacity`}></div>

          <!-- Border -->
          <div class="absolute inset-0 border border-slate-600/50 rounded-lg group-hover:border-slate-400/50 transition-colors"></div>

          <!-- Content -->
          <div class="relative p-6">
            <div class="flex items-start justify-between mb-4">
              <div class="text-4xl">{test.icon}</div>
              <span class={`text-xs font-bold px-3 py-1 rounded-full ${getComplexityColor(test.complexity)}`}>
                {test.complexity}
              </span>
            </div>

            <h3 class="text-lg font-bold mb-2">{test.title}</h3>
            <p class="text-sm text-slate-300 mb-4">{test.description}</p>

            {#if test.disabled}
              <div class="mb-4 text-sm text-yellow-300 flex items-center gap-2">
                <span>⏸️ In pausa per questa versione</span>
              </div>
            {/if}

            <div class="flex flex-wrap gap-2 mb-4">
              {#each test.metrics as metric}
                <span class="text-xs bg-slate-700/50 px-2 py-1 rounded border border-slate-600/50">
                  {metric}
                </span>
              {/each}
            </div>

            {#if !test.disabled}
              <button 
                class="w-full mt-4 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 py-2 px-4 rounded-lg font-semibold transition-all"
                onclick={() => window.location.href = test.path}
              >
                Vai al Test →
              </button>
            {/if}
          </div>
        </div>
      {/each}
    </div>

    <!-- Framework Comparison -->
    <div class="mb-12">
      <h2 class="text-2xl font-bold mb-6 flex items-center gap-2">
        🏗️ Framework Testati
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        {#each [
          {
            name: 'React',
            icon: '⚛️',
            features: ['Virtual DOM', 'Rich Ecosystem', 'Flessibilità']
          },
          {
            name: 'Svelte',
            icon: '⚡',
            features: ['Compilazione', 'Reattività Magica', 'Bundle Piccolo']
          },
          {
            name: 'Angular',
            icon: '🅰️',
            features: ['Full Framework', 'TypeScript', 'Enterprise Ready']
          }
        ] as fw (fw.name)}
          <div class="bg-slate-700/30 border border-slate-600/50 rounded-lg p-6 backdrop-blur-sm">
            <div class="text-3xl mb-3">{fw.icon}</div>
            <h3 class="text-lg font-bold mb-3">{fw.name}</h3>
            <ul class="space-y-2 text-sm text-slate-300">
              {#each fw.features as feature}
                <li class="flex items-center gap-2">
                  <span class="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                  {feature}
                </li>
              {/each}
            </ul>
          </div>
        {/each}
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
      {#each [
        { label: 'Test Disponibili', value: '4/5', icon: '📊' },
        { label: 'Metriche Misurate', value: '15+', icon: '📈' },
        { label: 'Max Items Testati', value: '10k', icon: '⚙️' },
        { label: 'Framework', value: '3', icon: '🏗️' }
      ] as stat (stat.label)}
        <div class="bg-slate-700/30 border border-slate-600/50 rounded-lg p-4 backdrop-blur-sm text-center">
          <div class="text-3xl mb-2">{stat.icon}</div>
          <p class="text-2xl font-bold text-blue-400">{stat.value}</p>
          <p class="text-sm text-slate-400">{stat.label}</p>
        </div>
      {/each}
    </div>
  </div>

  <!-- Modal Detail -->
  {#if selectedTest}
    <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-slate-800 border border-slate-600/50 rounded-lg p-8 max-w-md w-full">
        <div class="flex items-start justify-between mb-4">
          <div class="text-5xl">{selectedTest.icon}</div>
          <button
            onclick={closeModal}
            class="text-2xl hover:text-slate-300 transition-colors"
            aria-label="Chiudi modal"
          >
            ×
          </button>
        </div>
        <h2 class="text-2xl font-bold mb-2">{selectedTest.title}</h2>
        <p class="text-slate-400 mb-4">{selectedTest.details}</p>
        
        <div class="mb-6 bg-slate-700/50 p-4 rounded-lg">
          <p class="text-sm font-semibold text-slate-300 mb-2">Cosa misurerai:</p>
          <ul class="space-y-1">
            {#each selectedTest.metrics as metric}
              <li class="text-sm text-slate-400 flex items-center gap-2">
                <span class="w-1 h-1 bg-blue-400 rounded-full"></span>
                {metric}
              </li>
            {/each}
          </ul>
        </div>

        <div class="flex gap-3">
          <button
            onclick={closeModal}
            class="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
          >
            Annulla
          </button>
          <a
            href={selectedTest.path}
            class="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors text-center"
          >
            Inizia Test
          </a>
        </div>
      </div>
    </div>
  {/if}

  <!-- Footer -->
  <div class="border-t border-slate-700 bg-slate-800/50 mt-16 py-8">
    <div class="max-w-7xl mx-auto px-6 text-center text-slate-400 text-sm">
      <p>🚀 Benchmark Suite v1.0 | React ⚛️ vs Svelte ⚡ vs Angular 🅰️</p>
      <p class="mt-2">Test su Vercel | Misurazione con Lighthouse & Playwright</p>
    </div>
  </div>
</div>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  }
</style>