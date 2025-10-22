import { Component } from '@angular/core';

import { PokedexBit } from '../../../components/pokedex-bit/pokedex-bit';

@Component({
  selector: 'app-table-test-page',
  imports: [PokedexBit],
  template: `
    <app-pokedex-bit></app-pokedex-bit>
  `
})
export class TableTestPage {

}
