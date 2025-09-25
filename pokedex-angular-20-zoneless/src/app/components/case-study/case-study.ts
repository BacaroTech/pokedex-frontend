import {
  ChangeDetectorRef,
  Component,
  inject,
} from '@angular/core';

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

  cdr = inject(ChangeDetectorRef);

  message = 'Loading...';
  loaded = true;

  ngOnInit() {
    setTimeout(() => {
      this.message = 'App Loaded';
      this.loaded = true;
      this.cdr.detectChanges();
    }, 2000)
  }

  updateMessage()  {
    //no need call change detections because is a 
    // 'DOM event'
    this.message = 'New statement';
  };
}