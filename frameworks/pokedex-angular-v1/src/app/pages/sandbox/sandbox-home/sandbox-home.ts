import { Component } from '@angular/core';

import { Card } from '../../../components/shared/card/card';

@Component({
  selector: 'app-sandbox-home',
  imports: [Card],
  template: `
    <app-card href="/sandbox/table-full-csr-test" title="Tabella CSR" description="Go To Tabella CSR" />
    `,
  styleUrl: './sandbox-home.css'
})
export class SandboxHome {

}
