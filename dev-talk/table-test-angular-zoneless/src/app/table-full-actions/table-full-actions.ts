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

  public tableData = signal<TableRow[]>([]);

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
}
