import { Component } from '@angular/core';

@Component({
  selector: 'app-button-standalone',
  standalone: true,
  template: `
    <button (onclick)="submit()">SAVE</button>
  `
})
export class ButtonStandalone {
  submit() { 
    // ... 
  }
}
