'use client';

import React, { useState } from 'react';

import { cn } from '@/lib/utils/cn'; // Importiamo la funzione di merge

const ITEM_COUNT = 10000;

export default function ReactStressTest() {
  const [toggle, setToggle] = useState(false);

  // Forza il re-render e la riesecuzione di 1000 cn() calls
  const runTest = () => {
    setToggle(!toggle);
  };

  const items = Array.from({ length: ITEM_COUNT }, (_, index) => {
    const isEven = index % 2 === 0;

    // Questa logica forzerà twMerge a lavorare intensamente:
    // 1. "p-4" vs "p-10" (conflitto)
    // 2. Classi dinamiche: bg-gray-100 e text-red-600
    const className = cn(
      'w-full h-8 border-b text-sm font-mono', // Classi base
      isEven && 'bg-gray-100', // Condizione A
      toggle && 'text-red-600', // Condizione B
      // Passiamo una classe che CONFLIGGE con la classe base 'p-4' (implicita qui)
      index < 500 ? 'p-4' : 'p-10' 
    );

    return (
      <div key={index} className={className}>
        Item #{index + 1} ({toggle ? 'ON' : 'OFF'})
      </div>
    );
  });

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">React Performance Test (twMerge)</h1>
      <button 
        onClick={runTest} 
        className="px-4 py-2 bg-blue-500 text-white rounded my-4"
      >
        Trigger Re-render ({ITEM_COUNT} items)
      </button>
      <div className="border h-[400px] overflow-y-scroll">
        {items}
      </div>
    </div>
  );
}