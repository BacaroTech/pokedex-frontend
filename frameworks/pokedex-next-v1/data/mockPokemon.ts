// Definisce la struttura dell'oggetto Pokémon essenziale per il test
export interface MockPokemon {
  id: number;
  name: string;
  sprite: string;
  types: string[];
}

const BULBASAUR: MockPokemon = {
  id: 1,
  name: "Bulbasaur",
  // Usiamo una sprite di Bulbasaur 8-bit per l'estetica del test
  sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-i/red-blue/1.png",
  types: ["grass", "poison"],
};

const ITEM_COUNT = 1000;

/**
 * Genera un array di 1000 oggetti Pokémon duplicati per lo stress test.
 * @returns Array<MockPokemon>
 */
export function generateMockPokemon(): MockPokemon[] {
  // Genera 1000 copie di Bulbasaur
  return Array.from({ length: ITEM_COUNT }, (_, index) => ({
    ...BULBASAUR,
    // Aggiungiamo un ID univoco per la chiave di React
    id: index, 
    // Modifichiamo il nome per renderlo unico
    name: `${BULBASAUR.name} #${index + 1}`
  }));
}