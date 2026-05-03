import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401) {
          // FIX: clear sessionStorage (not localStorage)
          sessionStorage.clear();
          this.router.navigate(['/auth/login']);
        }
        if (err.status === 403) {
          // FIX: redirect to dedicated access-denied page
          this.router.navigate(['/access-denied']);
        }
        const message = err.error?.message || 'Une erreur est survenue';
        return throwError(() => new Error(message));
      })
    );
  }
}
