import { inject } from '@angular/core';
import { CanMatchFn } from '@angular/router';
import { AuthService } from '@shared/service/auth/auth.service';
import { map } from 'rxjs';

export const isGuestGuard: CanMatchFn = () => {
    return inject(AuthService).userType$.pipe(map(type => type === 'guest'));
};
