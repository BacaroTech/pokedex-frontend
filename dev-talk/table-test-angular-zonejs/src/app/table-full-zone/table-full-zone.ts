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
  imports: [CommonModule],
  templateUrl: './table-full-zone.html',
})
export class TableFullZoneComponent implements OnInit {
  @Input() cols: number = 20;
  @Input() rows: number = 1000;

  public tableData: TableRow[] = [];

  get colHeaders(): string[] {
    return this.tableData.length > 0
      ? Array.from({ length: this.cols }, (_, i) => `Campo ${i + 1}`)
      : [];
  }

  ngOnInit(): void {
    this.createRows();
  }

  createRows(): void {
    this.tableData = generateTestData(this.rows, this.cols);
  }

  clearRows(): void {
    this.tableData = [];
  }

  trackById(index: number, item: TableRow): number {
    return item.id;
  }
}