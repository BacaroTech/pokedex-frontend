import { NextResponse } from 'next/server';

// --- Type Definitions (è una buona pratica averle anche qui) ---
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

// --- Cache Semplice in Memoria lato Server ---
// Questa variabile conterrà i dati una volta caricati, per tutta la durata del processo del server.
let pokemonDetailsCache: Pokemon[] | null = null;

/**
 * Funzione helper che esegue il lavoro pesante: prende la lista base
 * e poi recupera i dettagli per ogni Pokémon in parallelo.
 */
async function fetchAndProcessPokemonAll(): Promise<Pokemon[]> {
    console.log('CACHE MISS: Fetching all 151 Pokémon details from PokeAPI...');
    
    // 1. Prendi la lista base dei Pokémon
    const listResponse = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
    if (!listResponse.ok) {
        throw new Error('Failed to fetch initial Pokémon list from PokeAPI');
    }
    const listData = await listResponse.json();

    // 2. Per ogni Pokémon nella lista, crea una "promessa" per ottenere i suoi dettagli
    const detailPromises = listData.results.map(async (p: { url:string; name: string }, index: number) => {
        const detailsResponse = await fetch(p.url);
        if (!detailsResponse.ok) {
            console.error(`Failed to fetch details for ${p.name}, skipping.`);
            return null; // Gestisce l'errore per un singolo Pokémon senza bloccare tutto
        }
        const details = await detailsResponse.json();
        
        // 3. Trasforma i dati nel formato pulito che il frontend si aspetta
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

    // Esegui tutte le chiamate di dettaglio in parallelo e aspetta che finiscano
    const results = await Promise.all(detailPromises);
    
    // Filtra eventuali risultati nulli (dovuti a errori) e restituisci l'array pulito
    return results.filter((p): p is Pokemon => p !== null);
}

async function fetchAndProcessPokemon(): Promise<Pokemon[]> {
  console.log('ANGULAR SSR CACHE MISS: Fetching all 151 Pokémon details from PokeAPI...');

  const listResponse = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
  if (!listResponse.ok) {
    throw new Error('Failed to fetch initial Pokémon list from PokeAPI');
  }
  const listData = await listResponse.json();

  const allPokemonDetails: (Pokemon | null)[] = [];
  const chunkSize = 20; // Elaboriamo 20 Pokémon alla volta per non sovraccaricare l'API

  for (let i = 0; i < listData.results.length; i += chunkSize) {
    const chunk = listData.results.slice(i, i + chunkSize);
    console.log(`Fetching details for Pokémon chunk starting at index ${i}...`);

    const detailPromises = chunk.map(async (p: { url: string; name: string }) => {
      try {
        const detailsResponse = await fetch(p.url);
        if (!detailsResponse.ok) {
          console.error(`Failed to fetch details for ${p.name}, skipping.`);
          return null;
        }
        const details = await detailsResponse.json();

        return {
          id: details.id, // Usiamo l'ID fornito direttamente dall'API di dettaglio
          name: p.name,
          types: details.types.map((t: { type: { name: string } }) => t.type.name),
          sprite: details.sprites.front_default,
          height: details.height,
          weight: details.weight,
          stats: details.stats
        };
      } catch (error) {
        console.error(`Fetch failed for ${p.name}:`, error);
        return null; // Se una chiamata fallisce, non blocchiamo tutto
      }
    });

    const chunkResults = await Promise.all(detailPromises);
    allPokemonDetails.push(...chunkResults);
  }

  // Filtriamo eventuali Pokémon che non siamo riusciti a caricare
  return allPokemonDetails.filter((p): p is Pokemon => p !== null);
}


export async function GET() {
  // 1. Controlla se la cache è già piena
  if (pokemonDetailsCache) {
    console.log('CACHE HIT: Returning cached Pokémon details list.');
    return NextResponse.json(pokemonDetailsCache);
  }
  
  try {
    // 2. Se la cache è vuota, esegui la funzione per recuperare e processare i dati
    const pokemonData = await fetchAndProcessPokemon();
    
    // 3. Salva i dati nella cache per le prossime volte
    pokemonDetailsCache = pokemonData;
    
    // 4. Restituisci i dati al client
    return NextResponse.json(pokemonData);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Error fetching Pokémon details list' },
      { status: 500 }
    );
  }
}
