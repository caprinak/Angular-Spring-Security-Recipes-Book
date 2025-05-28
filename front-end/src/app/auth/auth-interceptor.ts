import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpHeaders,
  HttpErrorResponse
} from '@angular/common/http';
import { take, exhaustMap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';

import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return this.authService.user.pipe(
      take(1),
      exhaustMap(user => {
        if (!user) {
          console.log('Auth interceptor: No user found');
          return next.handle(req);
        }
        console.log('Auth interceptor: Adding bearer token', req.url);
        const modifiedReq = req.clone({
          headers: req.headers.set('Authorization', `Bearer ${user.token}`)
        });
        return next.handle(modifiedReq).pipe(
          catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
              console.log('Auth interceptor: Token expired or invalid');
              this.authService.logout();
              this.router.navigate(['/auth']);
            }
            return throwError(() => error);
          })
        );
      })
    );
  }
}
