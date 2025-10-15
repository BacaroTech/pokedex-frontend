import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  signal,
} from '@angular/core';

// Funzione per generare i dati di test
const generateTestData = (rowCount: number, colCount: number) => {
  const data = [];
  for (let i = 0; i < rowCount; i++) {
    const row: any = { id: i };
    for (let j = 0; j < colCount; j++) {
      row[`field${j}`] = `Riga ${i + 1}, Cella ${j + 1}`;
    }
    data.push(row);
  }
  return data;
};

@Component({
  selector: 'app-table-test',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8 font-sans">
      <h1 class="text-2xl font-bold mb-4">Angular Performance Test (Standalone, Zoneless, Signals)</h1>
      <p class="mb-4">
        Test per creare una tabella con {{ ROW_COUNT }} righe e {{ COL_COUNT }} colonne.
      </p>
      <div class="flex space-x-2 mb-4">
        <button 
            (click)="createRows()"
            class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500">
            Crea {{ ROW_COUNT }} Righe
        </button>
        <button 
            (click)="clearRows()"
            class="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300">
            Pulisci Tabella
        </button>
      </div>

      <div class="overflow-x-auto border border-gray-200 rounded-lg">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              @if (tableData().length > 0) {
                @for (col of colHeaders; track $index) {
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {{ col }}
                  </th>
                }
              }
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            @for (row of tableData(); track row.id) {
              <tr>
                <td class="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{{ row.id + 1 }}</td>
                @for (i of colIndices; track i) {
                   <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{{ row['field' + i] }}</td>
                }
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableTest {
  ROW_COUNT = 1000;
  COL_COUNT = 50;
  
  tableData = signal<any[]>([]);
  
  // Per ottimizzare il template, creiamo degli array per le intestazioni e gli indici
  colHeaders = Array.from({ length: this.COL_COUNT }, (_, i) => `Campo ${i + 1}`);
  colIndices = Array.from({ length: this.COL_COUNT }, (_, i) => i);


  createRows() {
    console.time('Angular Rendering Time');
    const data = generateTestData(this.ROW_COUNT, this.COL_COUNT);
    this.tableData.set(data);
    
    // Usiamo un piccolo timeout per assicurare che il rendering sia completato
    // prima di registrare il tempo finale.
    setTimeout(() => {
        console.timeEnd('Angular Rendering Time');
    }, 0);
  }
  
  clearRows() {
      this.tableData.set([]);
  }
}
