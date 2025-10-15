import {
  Component,
  input,
  output,
} from '@angular/core';

import { User } from '../../user.model';

@Component({
  selector: 'app-user-profile-edit',
  standalone: true,
  template: `
    @if (user()) {
      <form (submit)="onSave()">
        <label>Name: <input [value]="user()?.name"></label>
        <button type="submit">Save</button>
      </form>
    }
  `,
  styles: ``
})
export class UserProfileEdit {
  user = input<User | null>(null)
  userSaved = output<User>();

  onSave() {
    // In a real app, you would get the updated form values here.
    const currentUser = this.user();

    if (currentUser) {
      this.userSaved.emit(currentUser);
    }
  }
}
