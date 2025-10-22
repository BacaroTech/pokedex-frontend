import {
  Component,
  input,
} from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  template: `
    <div class="mb-12">
      <a [href]="href()" aria-label="go-to-app">
        <div
          class="bg-slate-700/30 border border-slate-600/50 rounded-lg p-8 backdrop-blur-sm"
        >
          <h2 class="text-2xl font-bold mb-4 flex items-center gap-2">
            {{title()}}
          </h2>
          <p class="text-slate-300 leading-relaxed">
            {{description()}}
          </p>
        </div>
      </a>
    </div>
  `,
  styleUrl: './card.css'
})
export class Card {

  href = input();
  title = input();
  description = input();
}
