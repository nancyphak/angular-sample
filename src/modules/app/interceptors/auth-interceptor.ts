import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../../auth/services';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authToken = this.authService.getAuthToken();
    let authorizationValue = '';
    if (authToken) {
      authorizationValue = `${authToken.tokenType} ${authToken.accessToken}`;
    }
    let authReq: any;
    if (req.url.indexOf('api/') >= 0) {
      authReq = req.clone({
        headers: req.headers.set('Authorization', authorizationValue).set('Content-Type', 'application/json')
      });
    } else {
      return next.handle(req);
    }

    return next.handle(authReq).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse) {
          switch ((<HttpErrorResponse>error).status) {
            case 401:
              return this.handle401Error(req, next);
            default: {
              return throwError(error);
            }
          }
        } else {
          return throwError(error);
        }
      })
    );
  }

  handle401Error(req: HttpRequest<any>, next: HttpHandler) {
    return this.authService.refreshToken().pipe(
      switchMap((newToken: any) => {
        if (newToken && newToken.accessToken) {
          const authorizationValue = `Bearer ${newToken.accessToken}`;
          const authRequest = req.clone({
            headers: req.headers.set('Authorization', authorizationValue).set('Content-Type', 'application/json')
          });
          return next.handle(authRequest);
        }
        setTimeout(() => {
          this.authService.logout();
        }, 3000);
        return throwError('Can not renew token');
      }),
      catchError(error => {
        setTimeout(() => {
          this.authService.logout();
        }, 3000);
        return throwError(error);
      })
    );
  }

}

