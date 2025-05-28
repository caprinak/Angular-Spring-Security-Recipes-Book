# Frontend Authentication Guide

## Issue Description

The frontend is receiving a 401 Unauthorized error when trying to make a POST request to `http://localhost:8080/api/batch/recipes`. This indicates that the JWT token is either missing, invalid, or not being properly sent from the frontend to the backend.

Error details:
```
data-storage.service.ts:55 
POST http://localhost:8080/api/batch/recipes 401 (Unauthorized)

data-storage.service.ts:50 Store recipes error: 
HttpErrorResponse {headers: HttpHeaders, status: 401, statusText: 'OK', url: 'http://localhost:8080/api/batch/recipes', ok: false, …}
data-storage.service.ts:60 Error storing recipes: () => new Error('Failed to store recipes')
```

## How to Fix the Issue

The issue is likely due to the frontend not properly including the JWT token in the Authorization header when making requests to protected endpoints. Here's how to fix it:

### 1. Store the JWT Token After Login/Signup

When a user logs in or signs up, the backend returns an authentication response that includes a JWT token in the `idToken` field. This token needs to be stored in the frontend (typically in localStorage or a service) for later use.

```typescript
// Example of storing the token after login
login(email: string, password: string) {
  return this.http.post<AuthResponse>('http://localhost:8080/api/auth/login', {
    email: email,
    password: password,
    returnSecureToken: true
  }).pipe(
    tap(resData => {
      // Store the token
      this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
    })
  );
}

private handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {
  // Calculate expiration date
  const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
  
  // Store user data including token
  const user = new User(email, userId, token, expirationDate);
  localStorage.setItem('userData', JSON.stringify(user));
  
  // ... other authentication logic
}
```

### 2. Include the JWT Token in API Requests

For all requests to protected endpoints, include the JWT token in the Authorization header with the format `Bearer {token}`.

```typescript
// Example of including the token in a request
storeRecipes(recipes: Recipe[]) {
  // Get the current user and token
  const userData: {
    email: string;
    id: string;
    _token: string;
    _tokenExpirationDate: string;
  } = JSON.parse(localStorage.getItem('userData'));
  
  if (!userData) {
    console.error('No user data found. User must be logged in to store recipes.');
    return throwError(() => new Error('User not authenticated'));
  }
  
  const token = userData._token;
  
  // Include token in request headers
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });
  
  return this.http.post<Recipe[]>(
    'http://localhost:8080/api/batch/recipes',
    recipes,
    { headers: headers }
  ).pipe(
    catchError(errorRes => {
      console.error('Store recipes error:', errorRes);
      return throwError(() => new Error('Failed to store recipes'));
    })
  );
}
```

### 3. Use an HTTP Interceptor (Recommended)

A better approach is to use an HTTP interceptor to automatically add the Authorization header to all outgoing HTTP requests. This centralizes the token handling logic.

```typescript
// auth-interceptor.service.ts
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { take, exhaustMap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.authService.user.pipe(
      take(1),
      exhaustMap(user => {
        // Skip adding the token for auth endpoints
        if (!user || req.url.includes('/api/auth/')) {
          return next.handle(req);
        }
        
        // Clone the request and add the token
        const modifiedReq = req.clone({
          headers: new HttpHeaders({
            'Authorization': `Bearer ${user.token}`
          })
        });
        
        return next.handle(modifiedReq);
      })
    );
  }
}

// Register the interceptor in app.module.ts
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptorService } from './auth/auth-interceptor.service';

@NgModule({
  // ...
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    }
  ],
  // ...
})
export class AppModule { }
```

### 4. Handle Token Expiration

JWT tokens expire after a certain period (1 hour in this application). Implement logic to refresh the token before it expires or redirect the user to the login page when the token expires.

```typescript
// Example of token refresh logic
refreshToken() {
  const userData = JSON.parse(localStorage.getItem('userData'));
  if (!userData || !userData._refreshToken) {
    return throwError(() => new Error('No refresh token available'));
  }
  
  return this.http.post<AuthResponse>(
    'http://localhost:8080/api/auth/refresh-token',
    { refreshToken: userData._refreshToken }
  ).pipe(
    tap(resData => {
      this.handleAuthentication(
        resData.email,
        resData.localId,
        resData.idToken,
        +resData.expiresIn,
        resData.refreshToken
      );
    })
  );
}
```

## Testing the Fix

After implementing these changes:

1. Make sure the user is logged in before trying to store recipes
2. Verify that the JWT token is being included in the Authorization header
3. Check that the token is valid and has not expired
4. If the token has expired, refresh it or redirect the user to login

## Additional Debugging

The backend has been enhanced with better logging and error handling. If you continue to experience issues, check the server logs for more detailed error messages that will help identify the specific authentication problem.