import { Component } from '@angular/core';
import { AuthService } from 'modules/auth';
import { StorageService } from 'modules/shared';
import { MatDialog, MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent {
  userInfo: any;
  displayName: string;
  loading = false;

  constructor(private auth: AuthService,
              public snackBar: MatSnackBar,
              private storage: StorageService) {
    this.userInfo = this.storage.retrieve('userInfo');
    if (this.userInfo) {
      this.displayName = this.userInfo.name;
    }
  }

  onSubmit() {
    this.loading = true;
    this.auth.updateUserMetadata({
      name: this.displayName
    }).then(() => {
      this.loading = false;
      this.snackBar.open('Your display name has been changed successfully.', null, {duration: 3000});
    })
    .catch(error => {
      this.loading = false;
      this.snackBar.open('Sorry, some thing went wrong...');
      throw error;
    });
  }
}
