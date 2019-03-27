import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as auth0 from 'auth0-js';
import { Observable, timer, from } from 'rxjs';

import { environment as env } from '@app/env';
import { appConfig } from '@app/config';
import { StorageService } from 'modules/shared';
import { AuthToken } from '../models';

@Injectable()
export class AuthService {
  webAuth: any;
  auth0Manage: any;
  refreshSubscription: any;
  userId: string;
  userProfile = null;

  constructor(public router: Router, private storage: StorageService) {
    this.webAuth = new auth0.WebAuth(env.auth0Config);
    if (this.isAuthenticated()) {
      this.initManagement();
    }
  }

  public login(url?: string): void {
    const targetUrl = url ? url : appConfig.redirection.default;
    this.webAuth.authorize({ state: JSON.stringify({ url: targetUrl }) });
  }

  public handleAuthentication(): void {
    this.webAuth.parseHash((error, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.webAuth.client.userInfo(authResult.accessToken, (err, user) => {
          this.setSession(authResult, user);
          const targetUrl = JSON.parse(authResult.state).url;
          this.router.navigate([targetUrl]);
        });
        this.initManagement();

      } else if (error) {
        console.error('Was not able to parse hash', error);
        this.removeSession();
        this.login();
      } else {
        this.webAuth.authorize({ state: JSON.stringify({ url: appConfig.redirection.default }) });
      }
    });
  }

  public getAuthToken() {
    const authToken: AuthToken = this.storage.retrieve(appConfig.authentication.authTokenKey);
    if (authToken && AuthToken.isValid(authToken)) {
      return authToken;
    }
    return null;
  }

  public getUserName() {
    const userInfo = this.storage.retrieve('userInfo');
    return userInfo.name;
  }

  public async requestResetPassword() {
    return new Promise((resolve, reject) => {
      if (!this.userProfile) {
        reject('Cannot get user profile');
      } else if (this.userProfile.identities.some((item) => !item.isSocial)) {
        this.webAuth.changePassword({
          connection: this.userProfile.identities[0].connection,
          email: this.userProfile.email
        }, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      } else {
        reject('Your account can not reset password');
      }
    });

  }

  public getUserProfile(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.auth0Manage.getUser(this.userId, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  public updateUserMetadata(userMetadata: any): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.auth0Manage && !this.userId) {
        reject();
      }
      this.auth0Manage
        .patchUserMetadata(this.userId, userMetadata, (err, result) => {
          if (err) {
            reject(err);
          } else {
            const userInfo = this.storage.retrieve('userInfo');
            this.storage.store('userInfo', {
              ...userInfo,
              name: result.user_metadata.name
            });
            resolve(result);
          }
        });
    });
  }

  public logout(): void {
    this.removeSession();
    this.login();
  }

  public isAuthenticated(): boolean {
    const authToken: AuthToken = this.storage.retrieve(appConfig.authentication.authTokenKey);
    return (authToken && AuthToken.isValid(authToken));
  }

  public renewToken() {
    this.webAuth.checkSession({}, (err, result) => {
      if (err) {
        this.logout();
      } else {
        this.setSession(result);
      }
    });
  }

  public refreshToken(): Observable<any> {
    const defer = new Promise((resolve, reject) => {
      this.webAuth.checkSession({}, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
          this.setSession(result);
        }
      });
    });
    return from(defer);
  }

  public scheduleRenewal() {
    if (!this.isAuthenticated()) {
      return;
    }
    this.unScheduleRenewal();

    const authToken: AuthToken = this.storage.retrieve(appConfig.authentication.authTokenKey);
    const timerSubscription = timer(Math.max(1, authToken.exp - Date.now()));

    this.refreshSubscription = timerSubscription.subscribe(() => {
      this.renewToken();
    });
  }

  private setSession(authResult, userInfo?): void {
    const authToken = new AuthToken(authResult.accessToken, authResult.expiresIn, authResult.idToken);
    this.storage.store(appConfig.authentication.authTokenKey, authToken);
    if (userInfo) {
      this.storage.store('userInfo', userInfo);
    }
    this.scheduleRenewal();
  }

  private initManagement() {
    this.getTokenForManagement()
      .then((result) => {
        this.createAuth0Manage(result.accessToken);
        return true;
      })
      .then(() => {
        return this.getUserProfile();
      })
      .then((userProfile) => {
        this.userProfile = userProfile;
      });
  }

  private getTokenForManagement(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.webAuth.checkSession({
        audience: `https://${env.auth0Config.domain}/api/v2/`,
        scope: 'read:current_user update:current_user_metadata',
      }, (err, result) => {
        if (err) {
          reject(err);
        } else {
          this.userId = result.idTokenPayload.sub;
          resolve(result);
        }
      });
    });
  }

  private createAuth0Manage(accessToken: string) {
    this.auth0Manage = new auth0.Management({
      domain: env.auth0Config.domain,
      token: accessToken
    });
  }

  private removeSession(): void {
    this.storage.remove(appConfig.authentication.authTokenKey);
    this.storage.remove('userInfo');
    this.unScheduleRenewal();
  }

  private unScheduleRenewal() {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

}
