import {
  Component,
  computed,
  Input,
  signal,
} from '@angular/core';

import { generateTestData } from '../utils/table-sandbox';
import { TableRow } from '../utils/type.table-sandbox';

@Component({
  selector: 'app-table-full-actions',
  imports: [],
  templateUrl: './table-full-actions.html',
  styleUrl: './table-full-actions.css'
})
export class TableFullActions {
  @Input() cols: number = 20;
  @Input() rows: number = 1000;

  public tableData = signal<TableRow[]>(generateTestData(this.rows, this.cols));

  public colHeaders = computed(() => {
    return this.tableData().length > 0
      ? Array.from({ length: this.cols }, (_, i) => `Campo ${i + 1}`)
      : [];
  });

  createRows(): void {

    console.time("Angular-Zoneless Rendering Time");
    const data = generateTestData(this.rows, this.cols);
    this.tableData.set(data);
    setTimeout(() => {
      console.timeEnd("Angular-Zoneless Rendering Time");
    }, 0);
  }

  clearRows(): void {
    this.tableData.set([]);
  }

  swapRows(): void {
    console.time("Angular-Zoneless Swap Time");

    this.tableData.update(currentData => {
      if (currentData.length < 20) {
        return currentData; // Non ci sono abbastanza righe, restituisce lo stato corrente
      }

      const newData = [...this.tableData()]; // Crea una copia per l'immutabilità
      for (let i = 0; i < 10; i++) {
        const endIndex = newData.length - 1 - i;
        // Scambia il primo con l'ultimo, il secondo con il penultimo, etc.
        const temp = newData[i];
        newData[i] = newData[endIndex];
        newData[endIndex] = temp;
      }
      return newData; // Restituisce il nuovo stato per aggiornare il segnale
    });
    setTimeout(() => {
        console.timeEnd("Angular-Zoneless Swap Time");
    }, 0);
  }

  appendRowsAsync(): void {
    console.time("Angular-Zoneless Append Time");

// Genera 1000 nuove righe
    const newRowsToInsert = 1000;

    // 1. Simula una richiesta HTTP asincrona (macrotask)
    setTimeout(() => {
      // 2. Genera il nuovo blocco di dati con ID univoci
      const lastId = this.tableData().length > 0 ? this.tableData()[this.tableData().length - 1].id : 0;
      const newRows = generateTestData(newRowsToInsert, this.cols, lastId + 1);

      let newRowsIndex = 0;
      let finalData: TableRow[] = [];
      const currentData = this.tableData(); // Ottiene il valore corrente

      // 3. LOGICA DI INTERLACCIAMENTO
      const maxLength = Math.max(currentData.length, newRows.length);

      for (let i = 0; i < maxLength; i++) {
        // Aggiunge una riga esistente, se disponibile
        if (i < currentData.length) {
          finalData.push(currentData[i]);
        }

        // Aggiunge una nuova riga (la seconda posizione, "una riga si e una no")
        if (newRowsIndex < newRows.length) {
          finalData.push(newRows[newRowsIndex]);
          newRowsIndex++;
        }
      }

      // 4. AGGIORNA il Signal in modo immutabile
      this.tableData.set(finalData);

      console.timeEnd("Angular-Zoneless Interleaved Append Time");
    }, 0); // Ritardo simulato per il network
  }

}
