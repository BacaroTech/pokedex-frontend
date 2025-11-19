'use client';

import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  generateMockPokemon,
  type MockPokemon,
} from '@/data/mockPokemon';
import { cn } from '@/lib/utils/cn'; // Importiamo la funzione di merge

const ITEM_COUNT = 1000;
// Generiamo i dati una sola volta all'esterno del componente per evitare rigenerazioni inutili
const INITIAL_DATA = generateMockPokemon();

export default function PokemonStressTest() {
  const [pokemonList] = useState<MockPokemon[]>(INITIAL_DATA);
  const [isShiny, setIsShiny] = useState(false);
  const [isReady, setIsReady] = useState(false);
  
  // Variabile per tenere traccia se il test è in esecuzione
  const [isRunning, setIsRunning] = useState(false);

  // Forza il re-render di tutti i 1000 elementi, triggerando 1000 chiamate a cn()
  const runTest = useCallback(() => {
    if (isRunning) return;
    setIsRunning(true);
    
    // Iniziamo a misurare il tempo di rendering
    // Questo catturerà il tempo totale, inclusa l'esecuzione di cn() 1000 volte.
    console.time('React + twMerge Rendering Time');
    
    // Invertiamo lo stato per forzare il re-render e la logica condizionale
    setIsShiny(prev => !prev);
    
    // Usiamo un timeout per catturare il tempo dopo che React ha aggiornato il DOM
    setTimeout(() => {
      console.timeEnd('React + twMerge Rendering Time');
      setIsRunning(false);
    }, 0);
  }, [isRunning]);

  // Carica iniziale dei dati e setup
  useEffect(() => {
    // Simuliamo il tempo di caricamento iniziale
    setTimeout(() => setIsReady(true), 100); 
  }, []);

  if (!isReady) {
    return (
      <div className="p-8 text-center text-gray-400">Loading data for stress test...</div>
    );
  }

  return (
    <div className="p-8 font-sans bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-2">Pokémon Stress Test (with cn/twMerge)</h1>
      <p className="mb-4 text-gray-600">
        Misura l'overhead di 1000 esecuzioni della funzione **cn** (che include **twMerge**) forzando un re-render con classi condizionali e in conflitto.
      </p>

      <div className="flex space-x-2 mb-6">
        <button
          onClick={runTest}
          disabled={isRunning}
          // Utilizzo di cn() anche per il pulsante, per dimostrazione
          className={cn(
            "px-6 py-3 font-semibold text-white rounded-lg shadow-md transition-all duration-150",
            isRunning && "animate-pulse bg-red-700",
            !isRunning && "bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300"
          )}
        >
          {isRunning ? '...Misurando...' : 'Trigger Rerender (1000 cn() Calls)'}
        </button>
        <div className="flex items-center text-sm text-gray-700 border p-3 rounded-lg">
          Stato Attuale: **{isShiny ? 'Shiny Mode' : 'Normal Mode'}**
        </div>
      </div>
      
      {/* Container per i 1000 elementi */}
      <div className="h-[400px] overflow-y-scroll border border-gray-300 rounded-lg shadow-inner divide-y divide-gray-200">
        {pokemonList.map((p, index) => {
          
          // === LOGICA DI STRESS PER IL CN (1000 esecuzioni) ===
          
          const isEven = index % 2 === 0;
          const isHeavy = index > 500; 

          // itemClasses: Unione e risoluzione di 5 classi, due delle quali in conflitto (text-sm vs text-base)
          const itemClasses = cn(
            'flex items-center py-2 px-4 cursor-pointer',
            // Simple conditional
            isEven ? 'bg-gray-100' : 'bg-white', 
             // Conflict
            isHeavy ? 'text-base' : 'text-sm',
            // Toggle
            isShiny ? 'border-r-4 border-yellow-400' : 'border-r-4 border-transparent', 
             // Conflict
            isShiny ? 'text-yellow-600' : 'text-gray-900',
          );
          
          // spriteClasses: Seconda chiamata a cn() (1000 esecuzioni extra)
          const spriteClasses = cn(
             "w-8 h-8 mr-4", 
             isShiny && "grayscale" // Toggle visuale sulla sprite
          );
          // ==================================

          return (
            <div 
              key={p.id} 
              className={itemClasses}
            >
              <img 
                src={p.sprite} 
                alt={p.name} 
                className={spriteClasses}
                style={{imageRendering: 'pixelated'}}
              />
              <span className="font-medium truncate">{p.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}