import {
  Component,
  input,
} from '@angular/core';

import { User } from '../../user.model';

@Component({
  selector: 'app-user-profile-display',
  standalone: true,
  template: `
    @if (user()) {
      <h2>{{ user()?.name }}</h2>
      <p>Email: {{ user()?.email }}</p>
    }
  `
})
export class UserProfileDisplay {
  user = input<User | null>(null);
}
