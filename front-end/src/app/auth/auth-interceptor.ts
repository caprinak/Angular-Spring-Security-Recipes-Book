import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { exhaustMap, take } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return this.authService.user.pipe(
      take(1),
      exhaustMap(user => {
        // Add console.log to debug
        console.log('Interceptor running, user:', user);
        
        if (!user) {
          console.log('No user found in interceptor');
          return next.handle(request);
        }

        // Add console.log to verify token
        console.log('Adding token:', user.token);
        
        const modifiedReq = request.clone({
          headers: new HttpHeaders().set(
            'Authorization',
            `Bearer ${user.token}`
          )
        });

        // Log the final request
        console.log('Modified request headers:', modifiedReq.headers.get('Authorization'));
        
        return next.handle(modifiedReq);
      })
    );
  }
}