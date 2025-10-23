import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
} from '@angular/core';

import { generateTestData } from '../utils/table-sandbox';
import { TableRow } from '../utils/type.table-sandbox';

@Component({
  selector: 'app-table-full-actions',
  imports: [CommonModule],
  templateUrl: './table-full-actions.html',
  styleUrl: './table-full-actions.css'
})
export class TableFullActions {
  @Input() cols: number = 20;
  @Input() rows: number = 1000;

  public tableData: TableRow[] = generateTestData(this.rows, this.cols);

  get colHeaders(): string[] {
    return this.tableData.length > 0
      ? Array.from({ length: this.cols }, (_, i) => `Campo ${i + 1}`)
      : [];
  }

  createRows(): void {
    console.time("Angular-Zonejs Rendering Time");
    this.tableData = generateTestData(this.rows, this.cols);
    setTimeout(() => {
      console.timeEnd("Angular-Zonejs Rendering Time");
    }, 0);
  }

  clearRows(): void {
    this.tableData = [];
  }

  trackById(index: number, item: TableRow): number {
    return item.id;
  }

  swapRows(): void {
    console.time("Angular-Zonejs Swap Time");

    if (this.tableData.length < 20) {
      setTimeout(() => {
        console.timeEnd("Angular-Zonejs Swap Time");
    }, 0);
      return;
    }

    let newData = [...this.tableData]; // Crea una copia per l'immutabilità
    for (let i = 0; i < 10; i++) {
      const endIndex = newData.length - 1 - i;

      const temp = newData[i];
      newData[i] = newData[endIndex];
      newData[endIndex] = temp;
    }
    this.tableData = newData; // Assegna il nuovo array per triggerare l'aggiornamento
    setTimeout(() => {
        console.timeEnd("Angular-Zonejs Swap Time");
    }, 0);
  }
  appendRowsAsync(): void {

    setTimeout(() => {

      const newRowsToInsert = 1000;

      // 2. Genera il nuovo blocco di dati con ID univoci
      // Trova l'ultimo ID per generare nuovi ID univoci (necessario per trackBy)
      const lastId = this.tableData.length > 0 ? this.tableData[this.tableData.length - 1].id : 0;
      const newRows = generateTestData(newRowsToInsert, this.cols, lastId + 1);

      let newRowsIndex = 0;
      let finalData: TableRow[] = [];
      const currentData = this.tableData;

      // 3. LOGICA DI INTERLACCIAMENTO
      const maxLength = Math.max(currentData.length, newRows.length);

      for (let i = 0; i < maxLength; i++) {
        // Aggiunge una riga esistente
        if (i < currentData.length) {
          finalData.push(currentData[i]);
        }

        // Aggiunge una nuova riga
        if (newRowsIndex < newRows.length) {
          finalData.push(newRows[newRowsIndex]);
          newRowsIndex++;
        }
      }

      // 4. AGGIORNA la proprietà, triggerando un SECONDO ciclo di CD (quello utile)
      this.tableData = finalData;

    }, 0); // Ritardo simulato per il network
  }
}

