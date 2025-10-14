import { HttpClient } from '@angular/common/http';
import {
  Component,
  inject,
  signal,
} from '@angular/core';

@Component({
  selector: 'app-case-study-http-signals',
  template: `
   <h1>{{message()}}</h1>
   @if (loaded()) {
     <button (click)="updateMessage()">Aggiorna messaggio</button>
   }
 `,
  styleUrl: './case-study-http-signals.css'
})
export class CaseStudyHttpSignals {

  private http = inject(HttpClient);

  message = signal('Caricamento...');
  loaded = signal(false);

  ngOnInit() {
    this.fetchMessage();
  }

  fetchMessage() {
    
    this.http.get<{ message: string }>('https://api.example.com/data')
    .subscribe({
      next: (data) => {
        this.message.set(data.message);
        this.loaded.set(true);
      },
      error: (error) => {
        console.error('Errore durante il recupero dei dati:', error);
        this.message.set('Errore nel caricamento dei dati');
        this.loaded.set(true);
      }
    });
  }

  updateMessage() {
    this.message.set('Nuovo messaggio aggiornato');
  }
}