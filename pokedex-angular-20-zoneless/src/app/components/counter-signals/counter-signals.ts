import {
  Component,
  computed,
  signal,
} from '@angular/core';

@Component({
  selector: 'app-counter-signals',
  template: `
    <h2>Counter with Signals</h2>
    
    <p>Current value: <strong>{{ count() }}</strong></p>  
    <p>Double value: <strong>{{ doubleCount() }}</strong></p>
    
    <button (click)="increment()">Increment</button>
    <button (click)="decrement()">Decrement</button>
    <button (click)="reset()">Reset</button>
  `,
  styleUrl: './counter-signals.css'
})
export class CounterSignals {

  count = signal(0);

  doubleCount = computed(() => this.count() * 2);

  increment() {
    this.count.update(
      currentValue => currentValue + 1
    );
  }
  decrement() {
    this.count.update(
      currentValue => currentValue - 1
    );
  }
  reset() {
    this.count.set(0);
  }
}
