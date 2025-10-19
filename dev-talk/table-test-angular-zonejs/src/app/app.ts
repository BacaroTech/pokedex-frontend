import {
  Component,
  signal,
} from '@angular/core';

import {
  TableFullZoneComponent,
} from './table-full-zone-no-head/table-full-zone-no-head';

@Component({
  selector: 'app-root',
  imports: [TableFullZoneComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('table-test-angular-zonejs');
}
