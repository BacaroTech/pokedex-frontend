import { Component } from '@angular/core';

import { Card } from '../../../components/shared/card/card';

@Component({
  selector: 'app-pokedex-home',
  imports: [Card],
  standalone: true,
  template: `
    <app-card href="/pokedex/tabletest" title="Tabella Pokemon" description="Go To Tabella" />
    <app-card href="/pokedex/foldertree" title="Folder Pokemon" description="Go To Folder" />
    <app-card href="/pokedex/fiftyanimations" title="Animazioni Pokemon" description="Go To Animations" />
    <app-card href="/pokedex/realtimes" title="RealTime Pokemon" description="Go To Real Time" />
    <app-card href="/pokedex/kpistats" title="Statistiche Pokemon" description="Go To Statistiche" />
  `
})
export class PokedexHome {

}
