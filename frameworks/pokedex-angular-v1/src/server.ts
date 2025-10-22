import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';

import { join } from 'node:path';

import express from 'express';

// Type Definition per i dati dei Pokémon
interface Pokemon {
  id: number;
  name: string;
  types: string[];
  sprite: string;
  height: number;
  weight: number;
  stats: any[]; // Puoi definire un tipo più specifico se vuoi
}

// Cache in memoria lato server (identica a prima)
let pokemonDetailsCache: Pokemon[] | null = null;

/**
 * Funzione helper che esegue il fetch dei dati da PokeAPI.
 * Questa logica è identica a quella che avevamo definito per Express.
 */
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
const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();


/**
 * Qui è dove definiamo il nostro endpoint API.
 * Deve essere definito PRIMA del gestore universale di Angular.
 */
app.get('/api/pokemon/details', async (req, res) => {
  // 1. Controlla la cache
  if (pokemonDetailsCache) {
    console.log('ANGULAR SSR CACHE HIT: Returning cached Pokémon details list.');
    return res.json(pokemonDetailsCache);
  }

  try {
    // 2. Se la cache è vuota, recupera i dati
    const pokemonData = await fetchAndProcessPokemon();

    // 3. Salva i dati nella cache
    pokemonDetailsCache = pokemonData;

    // 4. Restituisci i dati al client
    return res.json(pokemonData);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error fetching Pokémon details list' });
  }
});

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
