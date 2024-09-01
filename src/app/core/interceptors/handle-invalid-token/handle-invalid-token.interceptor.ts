import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '@shared/service/auth/auth.service';
import { catchError, EMPTY, throwError } from 'rxjs';

export const handleInvalidTokenInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const destroyRef = inject(DestroyRef);

    return next(req).pipe(
        catchError((err: unknown) => {
            if (err instanceof HttpErrorResponse && err.status === 401) {
                authService.logout().pipe(takeUntilDestroyed(destroyRef)).subscribe();

                return EMPTY;
            }

            return throwError(() => err);
        }),
    );
};
