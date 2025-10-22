// fetch_pokemon_with_images.mjs

import fs from 'fs/promises';
import path from 'path';

// --- Configuration ---
const API_URL = 'https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0';
const OUTPUT_JSON_FILE = 'pokemon_data.json';
const IMAGES_DIRECTORY = 'pokemon_images';

// Set a limit for how many images to download.
// The full API has 1300+ entries, which can take a long time.
// Set to a smaller number like 25 for a quick test.
const DOWNLOAD_LIMIT = 10000;

/**
 * Downloads a single image from a URL and saves it to a local file path.
 * @param {string} url - The URL of the image to download.
 * @param {string} filepath - The local path to save the image to.
 */
async function downloadImage(url, filepath) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    // Convert the image response to a buffer to be written to a file
    const buffer = Buffer.from(await response.arrayBuffer());
    await fs.writeFile(filepath, buffer);
  } catch (error) {
    console.error(`  ✗ Could not download image from ${url}: ${error.message}`);
  }
}

/**
 * Fetches the detailed data for a single Pokémon to find its image URL,
 * then triggers the download.
 * @param {object} pokemonEntry - An object with { name, url } for a Pokémon.
 */
async function fetchPokemonDetailsAndImage(pokemonEntry) {
  try {
    // Fetch the detailed data for this specific Pokémon
    const response = await fetch(pokemonEntry.url);
    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }
    const details = await response.json();

    // The best quality image is usually in this location
    const imageUrl = details.sprites.other['official-artwork']?.front_default;

    if (imageUrl) {
      console.log(`- Found image for ${details.name}. Downloading...`);
      const imagePath = path.join(IMAGES_DIRECTORY, `${details.id}-${details.name}.png`);
      await downloadImage(imageUrl, imagePath);
    } else {
      console.log(`  ! No official artwork found for ${details.name}`);
    }
  } catch (error) {
    console.error(`  ✗ Failed to process ${pokemonEntry.name}: ${error.message}`);
  }
}

/**
 * Main function to run the entire process.
 */
async function run() {
  console.log('🚀 Starting Pokémon fetch process...');

  try {
    // 1. Create the images directory if it doesn't exist
    await fs.mkdir(IMAGES_DIRECTORY, { recursive: true });
    console.log(`📁 Directory '${IMAGES_DIRECTORY}' is ready.`);

    // 2. Fetch the main list of all Pokémon
    console.log(`📡 Fetching the main Pokémon list...`);
    const listResponse = await fetch(API_URL);
    if (!listResponse.ok) {
      throw new Error(`HTTP error! Status: ${listResponse.status}`);
    }
    const allPokemonData = await listResponse.json();

    // 3. Save the main list to a JSON file
    await fs.writeFile(OUTPUT_JSON_FILE, JSON.stringify(allPokemonData, null, 2));
    console.log(`✅ List of ${allPokemonData.results.length} Pokémon saved to ${OUTPUT_JSON_FILE}.`);

    // 4. Download an image for each Pokémon up to the defined limit
    const pokemonToProcess = allPokemonData.results.slice(0, DOWNLOAD_LIMIT);
    console.log(`\n🖼️  Now downloading images for the first ${pokemonToProcess.length} Pokémon...`);

    // Create an array of promises, one for each Pokémon to process.
    // This allows us to run the downloads concurrently.
    const downloadPromises = pokemonToProcess.map(pokemon => fetchPokemonDetailsAndImage(pokemon));

    // Wait for all the download promises to complete
    await Promise.all(downloadPromises);

    console.log(`\n🎉 Process complete! Images are in the '${IMAGES_DIRECTORY}' folder.`);

  } catch (error) {
    console.error('❌ A critical error occurred during the process:', error.message);
  }
}

// Let's run it!
run();