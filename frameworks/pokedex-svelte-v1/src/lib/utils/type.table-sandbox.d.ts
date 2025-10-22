  export interface TableRow {
    id: number;
    [key: string]: any; // Permette di avere campi dinamici come field0, field1, ecc.
  }