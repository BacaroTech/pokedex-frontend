import {
  ChangeDetectionStrategy,
  Component,
  computed,
  Input,
  OnInit,
  signal,
} from '@angular/core';

// CommonModule non è più necessario per @for e @if
import { generateTestData } from '../utils/table-sandbox';
import type { TableRow } from '../utils/type.table-sandbox';

@Component({
  selector: 'app-table-full-zoneless',
  standalone: true,
  templateUrl: './table-full-zoneless.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableFullZonelessComponent implements OnInit {
  @Input() cols: number = 20;
  @Input() rows: number = 1000;

  public tableData = signal<TableRow[]>([]);

  public colHeaders = computed(() => {
    return this.tableData().length > 0
      ? Array.from({ length: this.cols }, (_, i) => `Campo ${i + 1}`)
      : [];
  });

  ngOnInit(): void {
    this.createRows();
  }

  createRows(): void {    
    const data = generateTestData(this.rows, this.cols);
    this.tableData.set(data);
  }

  clearRows(): void {
    this.tableData.set([]);
  }
}