import {
  Component,
  computed,
  Input,
  signal,
} from '@angular/core';

import { generateTestData } from '../utils/table-sandbox';
import { TableRow } from '../utils/type.table-sandbox';

@Component({
  selector: 'app-table-full-prerender',
  imports: [],
  templateUrl: './table-full-prerender.html',
  styleUrl: './table-full-prerender.css'
})
export class TableFullPrerender {
 @Input() cols: number = 20;
  @Input() rows: number = 1000;

  // --- MODIFICA CHIAVE ---
  // Genera i dati immediatamente all'avvio del componente.
  // Il processo SSG eseguirà questo codice durante la build.
  public tableData = signal<TableRow[]>(
    generateTestData(this.rows, this.cols)
  );

  public colHeaders = computed(() => {
    return this.tableData().length > 0
      ? Array.from({ length: this.cols }, (_, i) => `Campo ${i + 1}`)
      : [];
  });

  /**
   * Questa funzione ora "ricrea" i dati sul client.
   * L'HTML iniziale sarà già renderizzato.
   */
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
        return currentData;
      }

      const newData = [...this.tableData()];
      for (let i = 0; i < 10; i++) {
        const endIndex = newData.length - 1 - i;
        const temp = newData[i];
        newData[i] = newData[endIndex];
        newData[endIndex] = temp;
      }
      return newData;
    });
    setTimeout(() => {
        console.timeEnd("Angular-Zoneless Swap Time");
    }, 0);
  }
}
