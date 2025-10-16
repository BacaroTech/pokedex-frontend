/**
 * Calcola la Media Aritmetica di un array di numeri.
 * @param data Array di misurazioni (es. in millisecondi).
 * @returns La media.
 */
export const calculateMean = (data: number[]): number => {
    if (data.length === 0) return 0;
    // La somma di tutti gli elementi divisa per il conteggio [5]
    const sum = data.reduce((acc, val) => acc + val, 0);
    return sum / data.length;
};

/**
 * Calcola la Deviazione Standard (del Campione) di un array di numeri.
 * @param data Array di misurazioni (es. in millisecondi).
 * @returns La deviazione standard.
 */
export const calculateStandardDeviation = (data: number[]): number => {
    // La Deviazione Standard del Campione usa N-1 al denominatore [6, 5]
    if (data.length <= 1) return 0; 
    
    const mean = calculateMean(data);
    const n = data.length;
    
    // Calcolo della Varianza (sum of squared differences from the mean) / (N-1)
    const variance = data.reduce((sum, val) => sum + (val - mean) ** 2, 0) / (n - 1);
    
    return Math.sqrt(variance);
};