import {
  Component,
  signal,
} from '@angular/core';

@Component({
  selector: 'app-case-study-signals',
  standalone: true,
  template: `
    <h1>{{message()}}</h1>
    @if (loaded()) {
      <button (click)=updateMessage()> update message </button>
    }
  `,
  styleUrl: './case-study-signals.css'
})
export class CaseStudySignals {
  
  message = signal('Loading...');
  loaded = signal(false);
  ngOnInit() {
    setTimeout(() => {
      this.message.set('App Loaded');
      this.loaded.set(true);
    }, 2000)
  }
  updateMessage()  {
    this.message.set('New statement');
  };
}
