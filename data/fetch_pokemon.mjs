// fetch_pokemon.mjs

// Import the 'fs/promises' module for writing files asynchronously
import fs from 'fs/promises';

// Define the API URL and the output file name
const API_URL = 'https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0';
const OUTPUT_FILE = 'pokemon_data.json';

/**
 * Fetches the complete list of Pokémon from the PokeAPI
 * and saves it to a local JSON file.
 */
async function fetchAndSavePokemon() {
  console.log(`🚀 Starting to fetch data from ${API_URL}...`);

  try {
    // 1. Make the API call
    const response = await fetch(API_URL);

    // Check if the response was successful (status code 200-299)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // 2. Extract the JSON data from the response
    const data = await response.json();
    console.log(`✅ Data received: ${data.results.length} Pokémon found.`);

    // 3. Write the data to a JSON file
    // JSON.stringify(data, null, 2) formats the JSON for readability
    await fs.writeFile(OUTPUT_FILE, JSON.stringify(data, null, 2));
    
    console.log(`💾 Data successfully saved to file: ${OUTPUT_FILE}`);

  } catch (error) {
    // Handle any network or file-writing errors
    console.error('❌ An error occurred:', error.message);
  }
}

// Run the function
fetchAndSavePokemon();