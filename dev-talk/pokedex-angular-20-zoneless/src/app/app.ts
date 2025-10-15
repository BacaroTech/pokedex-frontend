import {
  Component,
  signal,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { CaseStudy } from './components/case-study/case-study';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CaseStudy],
  standalone: true,
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('pokedex-angular-20-zoneless');
}
