"use client";
import React, { useState, useEffect } from 'react';
import { Search, ChevronLeft, X } from 'lucide-react';

// --- Type Definitions ---

// Definisce la struttura di una singola statistica del Pokémon
interface PokemonStat {
  base_stat: number;
  stat: {
    name: string;
  };
}

// Definisce la struttura completa dell'oggetto Pokémon che usiamo nell'app
interface Pokemon {
  id: number;
  name: string;
  types: string[];
  sprite: string;
  height: number;
  weight: number;
  stats: PokemonStat[];
}

// Definisce i tipi per l'oggetto dei colori
type TypeColors = {
  [key: string]: string;
};

// --- Component ---

const Pokedex8bit: React.FC = () => {
  // --- State with Types ---
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [filteredPokemon, setFilteredPokemon] = useState<Pokemon[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // --- Effects ---
  useEffect(() => {
    fetchPokemon();
  }, []);

  useEffect(() => {
    const filtered = pokemon.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toString().includes(searchTerm)
    );
    setFilteredPokemon(filtered);
  }, [searchTerm, pokemon]);

  // --- Functions ---
  const fetchPokemon = async (): Promise<void> => {
    try {
      const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
      const data = await response.json();
      
      const pokemonDetails: Pokemon[] = await Promise.all(
        data.results.map(async (p: { url: string; name: string }, index: number) => {
          const details = await fetch(p.url).then(res => res.json());
          return {
            id: index + 1,
            name: p.name,
            types: details.types.map((t: { type: { name: string } }) => t.type.name),
            sprite: details.sprites.front_default,
            height: details.height,
            weight: details.weight,
            stats: details.stats
          };
        })
      );
      
      setPokemon(pokemonDetails);
      setFilteredPokemon(pokemonDetails);
    } catch (error) {
      console.error('Error fetching Pokemon:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeColor = (type: string): string => {
    const colors: TypeColors = {
      normal: '#A8A878',
      fire: '#F08030',
      water: '#6890F0',
      electric: '#F8D030',
      grass: '#78C850',
      ice: '#98D8D8',
      fighting: '#C03028',
      poison: '#A040A0',
      ground: '#E0C068',
      flying: '#A890F0',
      psychic: '#F85888',
      bug: '#A8B820',
      rock: '#B8A038',
      ghost: '#705898',
      dragon: '#7038F8',
      dark: '#705848',
      steel: '#B8B8D0',
      fairy: '#EE99AC'
    };
    return colors[type] || '#68A090';
  };

  // --- Renders ---
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-2xl" style={{fontFamily: 'monospace'}}>
          LOADING...
        </div>
      </div>
    );
  }

  if (selectedPokemon) {
    return (
      <div className="min-h-screen bg-black text-white p-4" style={{fontFamily: 'monospace'}}>
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => setSelectedPokemon(null)}
            className="flex items-center gap-2 mb-6 text-green-400 hover:text-green-300 transition-colors"
          >
            <ChevronLeft size={20} />
            <span className="text-sm">BACK</span>
          </button>

          <div className="border-4 border-green-400 bg-gray-900 p-6">
            <div className="text-center mb-6">
              <div className="text-green-400 text-sm mb-2">
                No.{String(selectedPokemon.id).padStart(3, '0')}
              </div>
              <h1 className="text-3xl text-white mb-4 uppercase">
                {selectedPokemon.name}
              </h1>
              <div className="bg-black p-4 border-2 border-green-400 inline-block">
                <img
                  src={selectedPokemon.sprite}
                  alt={selectedPokemon.name}
                  className="w-32 h-32"
                  style={{imageRendering: 'pixelated'}}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="text-green-400 text-sm mb-2">TYPE</div>
                <div className="flex gap-2">
                  {selectedPokemon.types.map(type => (
                    <span
                      key={type}
                      className="px-3 py-1 text-xs uppercase border-2 text-white"
                      style={{
                        borderColor: getTypeColor(type),
                        backgroundColor: getTypeColor(type) + '40'
                      }}
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-green-400 text-sm mb-2">HEIGHT</div>
                  <div className="text-white">{selectedPokemon.height / 10} m</div>
                </div>
                <div>
                  <div className="text-green-400 text-sm mb-2">WEIGHT</div>
                  <div className="text-white">{selectedPokemon.weight / 10} kg</div>
                </div>
              </div>

              <div>
                <div className="text-green-400 text-sm mb-3">STATS</div>
                <div className="space-y-2">
                  {selectedPokemon.stats.map((stat: PokemonStat) => (
                    <div key={stat.stat.name}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-400 uppercase">
                          {stat.stat.name.replace('-', ' ')}
                        </span>
                        <span className="text-white">{stat.base_stat}</span>
                      </div>
                      <div className="bg-gray-800 h-2 border border-green-400">
                        <div
                          className="bg-green-400 h-full"
                          style={{width: `${(stat.base_stat / 255) * 100}%`}}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4" style={{fontFamily: 'monospace'}}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl text-green-400 mb-2">POKÉDEX</h1>
          <div className="text-gray-500 text-sm">Generation I</div>
        </div>

        <div className="mb-6">
          <div className="relative max-w-md mx-auto">
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <Search size={16} className="text-green-400" />
            </div>
            <input
              type="text"
              placeholder="SEARCH BY NAME OR NUMBER..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-900 border-2 border-green-400 text-white px-10 py-2 text-sm focus:outline-none focus:border-green-300"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X size={16} className="text-green-400 hover:text-green-300" />
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredPokemon.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedPokemon(p)}
              className="border-2 border-green-400 bg-gray-900 p-4 hover:bg-gray-800 hover:border-green-300 transition-all"
            >
              <div className="text-green-400 text-xs mb-2">
                #{String(p.id).padStart(3, '0')}
              </div>
              <div className="bg-black p-2 border border-green-400 mb-3">
                <img
                  src={p.sprite}
                  alt={p.name}
                  className="w-full h-20 object-contain"
                  style={{imageRendering: 'pixelated'}}
                />
              </div>
              <div className="text-white text-sm uppercase truncate">
                {p.name}
              </div>
              <div className="flex gap-1 mt-2 justify-center">
                {p.types.map(type => (
                  <div
                    key={type}
                    className="w-2 h-2 border border-white"
                    style={{backgroundColor: getTypeColor(type)}}
                  />
                ))}
              </div>
            </button>
          ))}
        </div>

        {filteredPokemon.length === 0 && (
          <div className="text-center text-gray-500 mt-12">
            NO POKÉMON FOUND
          </div>
        )}
      </div>
    </div>
  );
};

export default Pokedex8bit;

