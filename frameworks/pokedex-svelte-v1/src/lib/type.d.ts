  export type Complexity = 'Medio' | 'Alto' | 'Molto Alto' | 'Massimo'
  
  export type IdGradient =  1 | 2 | 3 | 4 | 5;
  export interface TestCase {
    id: number;
    title: string;
    description: string;
    icon: string;
    metrics: string[];
    complexity: Complexity;
    path: string;
    details: string;
    disabled?: boolean;
  }