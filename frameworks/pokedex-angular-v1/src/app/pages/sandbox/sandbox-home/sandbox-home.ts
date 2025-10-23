import { Component } from '@angular/core';

import { Card } from '../../../components/shared/card/card';

@Component({
  selector: 'app-sandbox-home',
  imports: [Card],
  template: `
    <app-card href="/sandbox/table-full-csr-test" title="Tabella CSR" description="Go To Tabella CSR" />
    <app-card href="/sandbox/table-full-ssr-test" title="Tabella SSR" description="Go To Tabella SSR" />
    <app-card href="/sandbox/table-full-ssg-test" title="Tabella SSG" description="Go To Tabella SSG" />
    `
})
export class SandboxHome {

}
