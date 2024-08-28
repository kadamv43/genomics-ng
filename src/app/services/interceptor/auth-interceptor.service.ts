import { Injectable } from '@angular/core';
import {
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
    HttpResponse,
    HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class AuthInterceptorService implements HttpInterceptor {
    constructor(private router: Router) {}

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        const token = localStorage.getItem('token');

        if (req.url.includes('/login')) {
            return next.handle(req);
        }

        if (token) {
            const clonedReq = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return next.handle(clonedReq).pipe(
                tap((event) => {
                    if (event instanceof HttpResponse) {
                        // Optionally handle successful responses here
                    }
                }),
                catchError((error: HttpErrorResponse) => {
                    if (error.status === 401) {
                        // Redirect to the login page if authentication fails
                        this.router.navigate(['/auth/login']);
                    }
                    return throwError(error);
                })
            );
        }

        return next.handle(req);
    }
}
