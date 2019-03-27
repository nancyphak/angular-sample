import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { appConfig } from '@app/config';
import { AuthService } from '../../services';

@Component({
  selector: 'login-callback',
  template: ''
})
export class LoginCallbackComponent implements OnInit {

  constructor(private router: Router,
              private auth: AuthService) {
  }

  ngOnInit() {
    if (this.auth.isAuthenticated()) {
      this.router.navigate([appConfig.redirection.default]);
    } else {
      this.auth.handleAuthentication();
    }
  }

}
