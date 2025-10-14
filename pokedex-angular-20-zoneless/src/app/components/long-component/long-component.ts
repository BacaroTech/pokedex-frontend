import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
} from '@angular/core';

import {
  Product,
  User,
} from '../user.model';

@Component({
  selector: 'app-long-component',
  templateUrl: 'long-component.html',
  imports: [CommonModule],
  standalone: true,
  styles: ``
})
export class LongComponent {
  user: User = { id: 1, name: 'Jane Doe', email: 'jane.doe@example.com' };

  handleUserSave() {
    console.log('User saved:', this.user);
    // Here, you would call a service to save the data to a server.
  }

  // 3. 'items' non è più un signal, ma una semplice proprietà di classe.
  items: Product[] = [
    { id: 1, name: 'Basic T-Shirt', price: 20 },
  ];

  // 4. Per gestire il change detection manualmente, iniettiamo ChangeDetectorRef.
  constructor(private cdr: ChangeDetectorRef) { }

  // 5. I valori calcolati ('computed') sono stati trasformati in 'getters'.
  // Vengono ricalcolati ogni volta che Angular esegue il change detection.
  get subtotal(): number {
    console.log('Calculating subtotal...'); // Questo loggherà ad ogni check
    return this.items.reduce((acc, item) => acc + item.price, 0);
  }

  get tax(): number {
    return this.subtotal * 0.10;
  }

  get total(): number {
    return this.subtotal + this.tax;
  }

  // Funzione necessaria per *ngFor per ottimizzare il rendering delle liste.
  trackById(index: number, item: Product): number {
    return item.id;
  }

  addProduct() {
    const newProduct = { id: Date.now(), name: 'Fancy Hat', price: 35 };

    // Aggiorniamo la proprietà di classe (creando un nuovo array per l'immutabilità)
    this.items = [...this.items, newProduct];

    // 6. IL PASSAGGIO CRUCIALE SENZA ZONE.JS:
    // Diciamo esplicitamente ad Angular: "Ehi, ho cambiato dei dati. Per favore,
    // schedula un controllo per aggiornare la vista."
    this.cdr.markForCheck();
  }

}
