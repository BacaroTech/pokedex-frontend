import { CommonModule } from '@angular/common'; // Necessario per *ngFor e *ngIf
import {
  Component,
  Input,
  OnInit,
} from '@angular/core';

import { generateTestData } from '../utils/table-sandbox';
import type { TableRow } from '../utils/type.table-sandbox';

@Component({
  selector: 'app-table-full-zone',
  standalone: true,
  imports: [CommonModule], // Importa CommonModule per le direttive
  templateUrl: './table-full-zone.html',
})
export class TableFullZoneComponent implements OnInit {
  @Input() cols: number = 10;
  @Input() rows: number = 100;

  public tableData: TableRow[] = [];

  // Usiamo un getter per i valori derivati.
  // Verrà ricalcolato ad ogni ciclo di change detection.
  get colHeaders(): string[] {
    return this.tableData.length > 0
      ? Array.from({ length: this.cols }, (_, i) => `Campo ${i + 1}`)
      : [];
  }

  // Il lifecycle hook onMount() di Svelte corrisponde a ngOnInit() in Angular.
  ngOnInit(): void {
    this.createRows();
  }

  createRows(): void {
    console.time('Angular (Zone.js) Rendering Time');
    // Assegnazione diretta alla proprietà. Zone.js rileverà il cambiamento.
    this.tableData = generateTestData(this.rows, this.cols);
  }

  clearRows(): void {
    this.tableData = [];
  }

  // Funzione trackBy per ottimizzare *ngFor, essenziale per le performance.
  // Corrisponde al (row.id) nel blocco #each di Svelte.
  trackById(index: number, item: TableRow): number {
    return item.id;
  }
}