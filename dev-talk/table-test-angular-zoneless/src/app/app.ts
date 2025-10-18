import {
  Component,
  signal,
} from '@angular/core';

import {
  TableFullZonelessComponent,
} from './table-full-zoneless/table-full-zoneless';

@Component({
  selector: 'app-root',
  imports: [TableFullZonelessComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('table-test-angular-zoneless');
}
