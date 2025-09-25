import { Component } from '@angular/core';

@Component({
  selector: 'app-case-study',
  standalone: true,
  template: `
    <h1>{{message}}</h1>
    @if (loaded) {
      <button (click)=updateMessage()> update message </button>
    }
  `,
  styleUrl: './case-study.css'
})
export class CaseStudy {

  message = 'Loading...';
  loaded = false;
  ngOnInit() {
    setTimeout(() => {
      this.message = 'App Loaded';
      this.loaded = true;
    }, 2000)
  }

  updateMessage()  {
    this.message = 'New statement';
  };
}
