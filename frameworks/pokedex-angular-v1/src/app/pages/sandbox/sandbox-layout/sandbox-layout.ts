import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-sandbox-layout',
  imports: [RouterOutlet],
  template: `<router-outlet />`,
  styleUrl: './sandbox-layout.css'
})
export class SandboxLayout {

}
