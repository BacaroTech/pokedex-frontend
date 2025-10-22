import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-pokedex-layout',
  imports: [RouterOutlet],
  template: `<router-outlet />`
})
export class PokedexLayout {

}
