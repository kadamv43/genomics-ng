import { Injectable } from '@angular/core';
import {
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
    HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

// Calls made before/without a session: a 401 here means "wrong credentials" or
// "invalid code", which the calling screen handles itself.
const PUBLIC_URL_PARTS = ['/login', 'forgot-password', 'reset-password', 'otp/'];

const SESSION_KEYS = ['token', 'role', 'mobile', 'config'];

@Injectable({
    providedIn: 'root',
})
export class AuthInterceptorService implements HttpInterceptor {
    constructor(private router: Router) {}

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        if (PUBLIC_URL_PARTS.some((part) => req.url.includes(part))) {
            return next.handle(req);
        }

        const token = localStorage.getItem('token');
        const request = token
            ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
            : req;

        return next.handle(request).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status === 401) {
                    this.handleUnauthorized();
                }
                return throwError(() => error);
            })
        );
    }

    private handleUnauthorized() {
        SESSION_KEYS.forEach((key) => localStorage.removeItem(key));

        // several in-flight requests can fail together; redirect only once
        if (!this.router.url.startsWith('/auth')) {
            this.router.navigate(['/auth/login']);
        }
    }
}
