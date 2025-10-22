import { Component } from '@angular/core';

import { Card } from '../../../components/shared/card/card';

@Component({
  selector: 'app-app-home',
  imports: [Card],
  standalone: true,
  template: `
    <app-card href="/app/tabletest" title="Tabella Pokemon" description="Go To Tabella" />
    <app-card href="/app/foldertree" title="Folder Pokemon" description="Go To Folder" />
    <app-card href="/app/fiftyanimations" title="Animazioni Pokemon" description="Go To Animations" />
    <app-card href="/app/realtimes" title="RealTime Pokemon" description="Go To Real Time" />
    <app-card href="/app/kpistats" title="Statistiche Pokemon" description="Go To Statistiche" />
  `,
  styleUrl: './app-home.css'
})
export class AppHome {

}
