import {
  Component,
  computed,
  signal,
} from '@angular/core';

import { Product } from '../../user.model';

@Component({
  selector: 'app-user-shopping-cart',
  standalone: true,
  template: `
   <h2>Shopping Cart</h2>
    <ul>
      @for (item of items(); track item.id) {
        <li>{{ item.name }} - \${{ item.price }}</li>
      }
    </ul>
    
    <button (click)="addProduct()">Add Product</button>
    
    <hr>
    
    <div>Subtotal: \${{ subtotal() }}</div>
    <div>Tax (10%): \${{ tax() }}</div>
    <div><strong>Total: \${{ total() }}</strong></div>
  `,
  styles: ``
})
export class UserShoppingCart {
  // 1. The source of truth is a writable signal.
  items = signal<Product[]>([
    { id: 1, name: 'Basic T-Shirt', price: 20 },
  ]);

  // 2. 'subtotal' is a computed signal that derives its value from 'items'.
  // It will only be recalculated if the 'items' array changes.
  subtotal = computed(() => {
    console.log('Calculating subtotal...'); // This logs only when items change
    return this.items().reduce((acc, item) => acc + item.price, 0);
  });

  // 3. You can chain computed signals. 'tax' depends on 'subtotal'.
  tax = computed(() => this.subtotal() * 0.10);

  // 4. 'total' depends on 'subtotal' and 'tax'.
  total = computed(() => this.subtotal() + this.tax());

  addProduct() {
    // When we update the source signal, all computed signals that depend on it
    // will be automatically updated by Angular.
    const newProduct = { id: Date.now(), name: 'Fancy Hat', price: 35 };
    this.items.update(currentItems => [...currentItems, newProduct]);
  }
}
