import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '@shared/service/auth/auth.service';
import { catchError, EMPTY, throwError } from 'rxjs';

export const handleInvalidTokenInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);

    return next(req).pipe(
        catchError((err: unknown) => {
            if (err instanceof HttpErrorResponse && err.status === 401) {
                authService.logout();

                return EMPTY;
            }

            return throwError(() => err);
        }),
    );
};
