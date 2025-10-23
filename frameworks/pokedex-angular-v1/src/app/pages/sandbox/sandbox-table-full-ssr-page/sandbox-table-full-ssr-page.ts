import { Component } from '@angular/core';

import {
  TableFullPrerender,
} from '../../../components/table-full-prerender/table-full-prerender';

@Component({
  selector: 'app-sandbox-table-full-ssr-page',
  imports: [TableFullPrerender],
  standalone: true,
  template: `
    <app-table-full-prerender />
  `
})
export class SandboxTableFullSSRPage {

}
