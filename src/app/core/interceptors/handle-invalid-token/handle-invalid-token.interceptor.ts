import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@shared/service/auth/auth.service';
import { catchError, EMPTY, throwError } from 'rxjs';

export const handleInvalidTokenInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    return next(req).pipe(
        catchError((err: unknown) => {
            if (err instanceof HttpErrorResponse && err.status === 401) {
                router.navigateByUrl('/signin');
                authService.setUserStatus('guest');
                localStorage.clear();

                return EMPTY;
            }

            return throwError(() => err);
        }),
    );
};
