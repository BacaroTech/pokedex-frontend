// fetch_detailed_pokemon.mjs

import fs from 'fs/promises';

// --- Configuration ---
const POKEMON_LIST_URL = 'https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0';
const OUTPUT_FILE = 'pokemon_details.json';

// Limita il numero di Pokémon da elaborare. 
// Imposta un numero basso (es. 20) per un test rapido.
// Per scaricare tutto, impostalo su un valore alto (es. 1500).
const PROCESS_LIMIT = 100000; 

// Numero di Pokémon da scaricare in parallelo per ogni batch.
// Un valore tra 5 e 10 è sicuro per evitare errori dall'API.
const CONCURRENCY_BATCH_SIZE = 10;

/**
 * Estrae e formatta 20 campi specifici dai dati grezzi dell'API.
 * @param {object} pokemonData - Dati dall'endpoint /pokemon/{id}
 * @param {object} speciesData - Dati dall'endpoint /pokemon-species/{id}
 * @returns {object} Un oggetto strutturato con le informazioni del Pokémon.
 */
function structurePokemonData(pokemonData, speciesData) {
  // Funzione di utilità per trovare un valore specifico nelle statistiche
  const getStat = (name) => pokemonData.stats.find(s => s.stat.name === name)?.base_stat ?? null;

  // Trova la prima descrizione in inglese disponibile
  const englishDescription = speciesData.flavor_text_entries.find(
    entry => entry.language.name === 'en'
  );

  return {
    id: pokemonData.id,
    name: pokemonData.name,
    description: englishDescription ? englishDescription.flavor_text.replace(/\s+/g, ' ') : null,
    types: pokemonData.types.map(t => t.type.name),
    height_m: pokemonData.height / 10, // Convertito in metri
    weight_kg: pokemonData.weight / 10, // Convertito in kg
    base_experience: pokemonData.base_experience,
    abilities: pokemonData.abilities.map(a => a.ability.name),
    
    // Stats
    hp: getStat('hp'),
    attack: getStat('attack'),
    defense: getStat('defense'),
    special_attack: getStat('special-attack'),
    special_defense: getStat('special-defense'),
    speed: getStat('speed'),

    // Dati dalla specie
    generation: speciesData.generation?.name ?? null,
    color: speciesData.color?.name ?? null,
    habitat: speciesData.habitat?.name ?? null,
    is_legendary: speciesData.is_legendary,
    is_mythical: speciesData.is_mythical,

    // URL dell'immagine principale
    sprite_official_artwork: pokemonData.sprites.other['official-artwork']?.front_default ?? null,
  };
}

/**
 * Scarica i dati completi per un singolo Pokémon da due endpoint diversi.
 * @param {object} pokemonEntry - Un oggetto con { name, url }.
 * @returns {Promise<object|null>} L'oggetto Pokémon strutturato o null in caso di errore.
 */
async function fetchSinglePokemonDetails(pokemonEntry) {
  try {
    // 1. Scarica i dati principali del Pokémon
    const pokemonResponse = await fetch(pokemonEntry.url);
    if (!pokemonResponse.ok) throw new Error(`Failed to fetch main data for ${pokemonEntry.name}`);
    const pokemonData = await pokemonResponse.json();

    // 2. Scarica i dati della specie per la descrizione
    const speciesResponse = await fetch(pokemonData.species.url);
    if (!speciesResponse.ok) throw new Error(`Failed to fetch species data for ${pokemonEntry.name}`);
    const speciesData = await speciesResponse.json();

    // 3. Struttura e combina i dati
    return structurePokemonData(pokemonData, speciesData);
  } catch (error) {
    console.error(`- ❌ Errore durante l'elaborazione di ${pokemonEntry.name}: ${error.message}`);
    return null; // Restituisce null per non bloccare l'intero processo
  }
}

/**
 * Funzione principale che orchestra il processo di download.
 */
async function run() {
  console.log('🚀 Avvio del processo di download dettagliato dei Pokémon...');
  const startTime = Date.now();
  
  try {
    // 1. Ottieni la lista completa dei Pokémon
    console.log('📡 Sto scaricando la lista principale dei Pokémon...');
    const listResponse = await fetch(POKEMON_LIST_URL);
    if (!listResponse.ok) throw new Error('Impossibile scaricare la lista dei Pokémon.');
    const allPokemonList = (await listResponse.json()).results;
    
    const pokemonToProcess = allPokemonList.slice(0, PROCESS_LIMIT);
    console.log(`📋 Lista ricevuta. Elaborerò i primi ${pokemonToProcess.length} Pokémon in batch da ${CONCURRENCY_BATCH_SIZE}.`);

    const allPokemonDetails = [];
    
    // 2. Elabora i Pokémon in batch per gestire la concorrenza
    for (let i = 0; i < pokemonToProcess.length; i += CONCURRENCY_BATCH_SIZE) {
      const batch = pokemonToProcess.slice(i, i + CONCURRENCY_BATCH_SIZE);
      console.log(`\n🌀 Elaborazione batch ${Math.floor(i / CONCURRENCY_BATCH_SIZE) + 1}... (${i + 1}-${i + batch.length})`);

      const batchPromises = batch.map(p => fetchSinglePokemonDetails(p));
      const results = await Promise.all(batchPromises);

      // Filtra eventuali risultati null (dovuti a errori) e aggiungili alla lista principale
      allPokemonDetails.push(...results.filter(p => p !== null));
    }
    
    // 3. Salva i dati completi in un file JSON
    console.log(`\n💾 Salvataggio di ${allPokemonDetails.length} record di Pokémon in ${OUTPUT_FILE}...`);
    await fs.writeFile(OUTPUT_FILE, JSON.stringify(allPokemonDetails, null, 2));

    const duration = (Date.now() - startTime) / 1000;
    console.log(`\n🎉 Processo completato in ${duration.toFixed(2)} secondi!`);

  } catch (error) {
    console.error('❌ Si è verificato un errore critico:', error.message);
  }
}

run();