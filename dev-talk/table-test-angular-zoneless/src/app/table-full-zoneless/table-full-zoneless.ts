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
  changeDetection: ChangeDetectionStrategy.OnPush, // Abilita la modalità Zoneless
})
export class TableFullZonelessComponent implements OnInit {
  @Input() cols: number = 10;
  @Input() rows: number = 100;

  // Lo stato è un signal. Qualsiasi cambiamento notificherà solo i consumer.
  public tableData = signal<TableRow[]>([]);

  // I valori derivati usano `computed`, l'equivalente di $derived in Svelte.
  // Si aggiorna solo quando il signal `tableData` cambia.
  public colHeaders = computed(() => {
    return this.tableData().length > 0
      ? Array.from({ length: this.cols }, (_, i) => `Campo ${i + 1}`)
      : [];
  });

  ngOnInit(): void {
    this.createRows();
  }

  createRows(): void {
    console.time('Angular (Zoneless + Signals) Rendering Time');
    const data = generateTestData(this.rows, this.cols);
    // Per aggiornare un signal, usiamo il metodo .set()
    this.tableData.set(data);

    setTimeout(() => {
      console.timeEnd('Angular (Zoneless + Signals) Rendering Time');
    }, 0);
  }

  clearRows(): void {
    this.tableData.set([]);
  }
}