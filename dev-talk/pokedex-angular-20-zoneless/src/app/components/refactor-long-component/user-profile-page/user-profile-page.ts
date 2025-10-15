import { Component } from '@angular/core';

import { User } from '../../user.model';
import {
  UserProfileDisplay,
} from '../user-profile-display/user-profile-display';
import { UserProfileEdit } from '../user-profile-edit/user-profile-edit';
import { UserShoppingCart } from '../user-shopping-cart/user-shopping-cart';

@Component({
  selector: 'app-user-profile-page',
  standalone: true,
  imports: [UserProfileDisplay, UserProfileEdit, UserShoppingCart],
  template: `
    <h1>User Profile</h1>
    <app-user-profile-display [user]="currentUser"></app-user-profile-display>
    <app-user-profile-edit [user]="currentUser" (userSaved)="handleUserSave($event)"></app-user-profile-edit>
    <app-user-shopping-cart />
  `,
  styles: ``
})
export class UserProfilePage {
 
  currentUser: User = { id: 1, name: 'Jane Doe', email: 'jane.doe@example.com' };

  handleUserSave(updatedUser: User) {
    console.log('User saved:', updatedUser);
  }
}
