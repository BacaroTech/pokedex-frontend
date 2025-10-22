import {
  Component,
  signal,
} from '@angular/core';

import { TableFullActions } from './table-full-actions/table-full-actions';

@Component({
  selector: 'app-root',
  imports: [TableFullActions],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('table-test-angular-zonejs');
}
