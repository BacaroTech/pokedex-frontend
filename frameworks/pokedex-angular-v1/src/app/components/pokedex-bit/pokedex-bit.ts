import {
  DecimalPipe,
  NgOptimizedImage,
} from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';

import { lastValueFrom } from 'rxjs';

// --- Type Definitions (rimangono identiche) ---
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


@Component({
  selector: 'app-pokedex-bit',
  standalone: true,
  
  imports: [NgOptimizedImage, DecimalPipe], 
  changeDetection: ChangeDetectionStrategy.OnPush, // Fondamentale per zoneless e performance
  template: `
    <!-- 1. Schermata di caricamento -->
    @if (loading()) {
      <div class="min-h-screen bg-black flex items-center justify-center">
        <div class="text-white text-2xl" style="font-family: monospace;">
          LOADING...
        </div>
      </div>
    } 
    <!-- 2. Vista di dettaglio del Pokémon selezionato -->
    @else if (selectedPokemon(); as pokemon) {
      <div class="min-h-screen bg-black text-white p-4" style="font-family: monospace;">
        <div class="max-w-2xl mx-auto">
          <button
            (click)="selectedPokemon.set(null)"
            class="flex items-center gap-2 mb-6 text-green-400 hover:text-green-300 transition-colors"
          >
            <!-- Icona SVG per ChevronLeft -->
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            <span class="text-sm">BACK</span>
          </button>

          <div class="border-4 border-green-400 bg-gray-900 p-6">
            <div class="text-center mb-6">
              <div class="text-green-400 text-sm mb-2">
                No.{{ pokemon.id | number:'3.0-0' }}
              </div>
              <h1 class="text-3xl text-white mb-4 uppercase">
                {{ pokemon.name }}
              </h1>
              <div class="bg-black p-4 border-2 border-green-400 inline-block">
                <img
                  [ngSrc]="pokemon.sprite"
                  [alt]="pokemon.name"
                  width="128"
                  height="128"
                  style="image-rendering: pixelated;"
                />
              </div>
            </div>

            <div class="space-y-4">
              <div>
                <div class="text-green-400 text-sm mb-2">TYPE</div>
                <div class="flex gap-2">
                  @for (type of pokemon.types; track type) {
                    <span
                      class="px-3 py-1 text-xs uppercase border-2 text-white"
                      [style.borderColor]="getTypeColor(type)"
                      [style.backgroundColor]="getTypeColor(type) + '40'"
                    >
                      {{ type }}
                    </span>
                  }
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <div class="text-green-400 text-sm mb-2">HEIGHT</div>
                  <div class="text-white">{{ pokemon.height / 10 }} m</div>
                </div>
                <div>
                  <div class="text-green-400 text-sm mb-2">WEIGHT</div>
                  <div class="text-white">{{ pokemon.weight / 10 }} kg</div>
                </div>
              </div>

              <div>
                <div class="text-green-400 text-sm mb-3">STATS</div>
                <div class="space-y-2">
                  @for (stat of pokemon.stats; track stat.stat.name) {
                    <div>
                      <div class="flex justify-between text-xs mb-1">
                        <span class="text-gray-400 uppercase">
                          {{ stat.stat.name.replace('-', ' ') }}
                        </span>
                        <span class="text-white">{{ stat.base_stat }}</span>
                      </div>
                      <div class="bg-gray-800 h-2 border border-green-400">
                        <div
                          class="bg-green-400 h-full"
                          [style.width.%]="(stat.base_stat / 255) * 100"
                        ></div>
                      </div>
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    } 
    <!-- 3. Vista principale con la lista e la ricerca -->
    @else {
      <div class="min-h-screen bg-black text-white p-4" style="font-family: monospace;">
        <div class="max-w-6xl mx-auto">
          <div class="text-center mb-8">
            <h1 class="text-4xl text-green-400 mb-2">POKÉDEX</h1>
            <div class="text-gray-500 text-sm">Generation I</div>
          </div>

          <div class="mb-6">
            <div class="relative max-w-md mx-auto">
              <div class="absolute left-3 top-1/2 -translate-y-1/2">
                 <!-- Icona SVG per Search -->
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </div>
              <input
                type="text"
                placeholder="SEARCH BY NAME OR NUMBER..."
                [value]="searchTerm()"
                (input)="onSearch($event)"
                class="w-full bg-gray-900 border-2 border-green-400 text-white px-10 py-2 text-sm focus:outline-none focus:border-green-300"
              />
              @if (searchTerm()) {
                <button
                  (click)="searchTerm.set('')"
                  class="absolute right-3 top-1/2 -translate-y-1/2"
                >
                   <!-- Icona SVG per X -->
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
              }
            </div>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            @for (p of filteredPokemon(); track p.id) {
              <button
                (click)="selectedPokemon.set(p)"
                class="border-2 border-green-400 bg-gray-900 p-4 hover:bg-gray-800 hover:border-green-300 transition-all"
              >
                <div class="text-green-400 text-xs mb-2">
                  #{{ p.id | number:'3.0-0' }}
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
                    [ngSrc]="p.sprite"
                    [alt]="p.name"
                    width="100"
                    height="80"
                    style="image-rendering: pixelated; width: 100%; height: 80px; object-fit: contain;"
                  />
                </div>
                <div class="text-white text-sm uppercase truncate">
                  {{ p.name }}
                </div>
                <div class="flex gap-1 mt-2 justify-center">
                  @for (type of p.types; track type) {
                    <div
                      class="w-2 h-2 border border-white"
                      [style.backgroundColor]="getTypeColor(type)"
                    ></div>
                  }
                </div>
              </button>
            }
          </div>

          @if (filteredPokemon().length === 0) {
            <div class="text-center text-gray-500 mt-12">
              NO POKÉMON FOUND
            </div>
          }
        </div>
      </div>
    }
  `
})
export class PokedexBit implements OnInit {
  // --- State as Signals ---
  // signal() crea uno stato reattivo.
  pokemon = signal<Pokemon[]>([]);
  searchTerm = signal<string>('');
  selectedPokemon = signal<Pokemon | null>(null);
  loading = signal<boolean>(true);

  // --- Derived State with computed() ---
  // Questo signal si ricalcola automaticamente quando pokemon() o searchTerm() cambiano.
  // È l'equivalente del secondo useEffect in React.
  filteredPokemon = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.pokemon().filter(p => 
      p.name.toLowerCase().includes(term) ||
      p.id.toString().includes(term)
    );
  });
  
  // --- Dependency Injection ---
  private http = inject(HttpClient);

  // --- Lifecycle Hook ---
  // ngOnInit è simile a useEffect con dipendenze vuote [].
  ngOnInit(): void {
    this.fetchPokemon();
  }

  // --- Functions ---
  async fetchPokemon(): Promise<void> {
    try {
   
      const responseLocal: any = await lastValueFrom(
        this.http.get('/api/pokemon/details')
      );

      const pokemonDetails: Pokemon[] = responseLocal as Pokemon[]
      
      this.pokemon.set(pokemonDetails);
    } catch (error) {
      console.error('Error fetching Pokemon:', error);
    } finally {
      this.loading.set(false);
    }
  }

  getTypeColor(type: string): string {
    const colors: TypeColors = {
      normal: '#A8A878', fire: '#F08030', water: '#6890F0', electric: '#F8D030',
      grass: '#78C850', ice: '#98D8D8', fighting: '#C03028', poison: '#A040A0',
      ground: '#E0C068', flying: '#A890F0', psychic: '#F85888', bug: '#A8B820',
      rock: '#B8A038', ghost: '#705898', dragon: '#7038F8', dark: '#705848',
      steel: '#B8B8D0', fairy: '#EE99AC'
    };
    return colors[type] || '#68A090';
  }

  // Event handler per l'input di ricerca
  onSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerm.set(target.value);
  }
}
