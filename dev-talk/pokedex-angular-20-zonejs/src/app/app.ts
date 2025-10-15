import {
  Component,
  signal,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { CaseStudy } from './components/case-study/case-study';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CaseStudy],
  templateUrl: './app.html',
  standalone: true,
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('pokedex-angular-20-zonejs');
}
