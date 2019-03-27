import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { AuthService } from 'modules/auth/services';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService) {
  }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authService.isAuthenticated()) {
      return true;
    } else {
      this.authService.login(state.url);
      return false;
    }

  }
}
