import { Component } from '@angular/core';

import { Card } from '../../components/shared/card/card';

@Component({
  selector: 'app-home-page',
  imports: [Card],
  standalone: true,
  template: `
    <app-card href="/pokedex" title="Pokedex" description="Go To Pokedex app" />
    <app-card href="/sandbox" title="Sandbox" description="Go To Sandbox tes" />
  `,
  styleUrl: './home-page.css'
})
export class HomePage {

}
