import { Component } from '@angular/core';

import { ButtonStandalone } from '../button-standalone/button-standalone';

@Component({
  selector: 'app-form-standalone',
  standalone: true,
  imports: [ButtonStandalone],
  template: `
    <form>
      LONG FORM 
      <app-button-standalone />
    </form>
  `
})
export class FormStandalone {

}
