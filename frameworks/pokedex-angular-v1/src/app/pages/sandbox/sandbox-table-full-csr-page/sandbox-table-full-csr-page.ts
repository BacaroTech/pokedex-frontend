import { Component } from '@angular/core';

import {
  TableFullActions,
} from '../../../components/table-full-actions/table-full-actions';

@Component({
  selector: 'app-sandbox-table-full-csr-page',
  imports: [TableFullActions],
  standalone: true,
  template: `
    <app-table-full-actions />
  `
})
export class SandboxTableFullCsrPage {

}
