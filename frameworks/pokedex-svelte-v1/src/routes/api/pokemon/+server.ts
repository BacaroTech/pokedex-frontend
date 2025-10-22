import { json } from '@sveltejs/kit';

import type { RequestHandler } from './$types';

// --- Type Definitions (identiche a prima) ---
interface PokemonStat {
  base_stat: number;
  stat: { name: string; };
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

// --- Cache Semplice in Memoria lato Server (identica a prima) ---
let pokemonDetailsCache: Pokemon[] | null = null;

/**
 * Funzione helper che esegue il lavoro pesante.
 * Questa logica è identica a quella della versione Next.js.
 */
async function fetchAndProcessPokemon(): Promise<Pokemon[]> {
    console.log('SVELTE CACHE MISS: Fetching all 151 Pokémon details from PokeAPI...');
    
    const listResponse = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
    if (!listResponse.ok) {
        throw new Error('Failed to fetch initial Pokémon list from PokeAPI');
    }
    const listData = await listResponse.json();

    const detailPromises = listData.results.map(async (p: { url:string; name: string }, index: number) => {
        const detailsResponse = await fetch(p.url);
        if (!detailsResponse.ok) {
            console.error(`Failed to fetch details for ${p.name}, skipping.`);
            return null;
        }
        const details = await detailsResponse.json();
        
        return {
            id: index + 1,
            name: p.name,
            types: details.types.map((t: { type: { name: string } }) => t.type.name),
            sprite: details.sprites.front_default,
            height: details.height,
            weight: details.weight,
            stats: details.stats
        };
    });

    const results = await Promise.all(detailPromises);
    return results.filter((p): p is Pokemon => p !== null);
}

// --- Request Handler GET di SvelteKit ---
export const GET: RequestHandler = async () => {
  // 1. Controlla se la cache è già piena
  if (pokemonDetailsCache) {
    console.log('SVELTE CACHE HIT: Returning cached Pokémon details list.');
    // La funzione json() di SvelteKit crea e restituisce una Response formattata
    return json(pokemonDetailsCache);
  }
  
  try {
    // 2. Se la cache è vuota, esegui la funzione per recuperare i dati
    const pokemonData = await fetchAndProcessPokemon();
    
    // 3. Salva i dati nella cache
    pokemonDetailsCache = pokemonData;
    
    // 4. Restituisci i dati al client
    return json(pokemonData);
  } catch (error) {
    console.error(error);
    // In caso di errore, restituisci uno stato 500
    return json(
      { message: 'Error fetching Pokémon details list' },
      { status: 500 }
    );
  }
};
