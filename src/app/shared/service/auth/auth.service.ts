import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { AuthUser, UserType } from '@type/user-type.type';
import { BehaviorSubject, map, Observable, switchMap, tap } from 'rxjs';
import { Router } from '@angular/router';
import { accessTokenName, ADMIN_TOKEN_SHORT_NAME } from './token-names.const';

type Token = { token: string };
@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private readonly userType$$ = new BehaviorSubject<UserType>('guest');

    readonly userType$ = this.userType$$.asObservable();
    readonly isAuthorized$ = this.userType$$.pipe(map(type => type !== 'guest'));

    constructor(
        private readonly httpClient: HttpClient,
        private readonly router: Router,
        private readonly z: NgZone,
    ) {}

    singUp(payLoad: AuthUser): Observable<Token> {
        return this.httpClient.post('/api/signup', payLoad).pipe(
            switchMap(() => this.logIn(payLoad)),
            tap({
                error: () => {
                    this.setUserStatus('guest');
                },
            }),
        );
    }

    logIn(payLoad: AuthUser): Observable<Token> {
        return this.httpClient.post<Token>('/api/signin', payLoad).pipe(
            tap({
                next: ({ token }) => {
                    const isAdmin = import.meta.env.NG_APP_ADMINS.includes(payLoad.email);

                    if (isAdmin) {
                        this.setUserStatus('admin');
                    }

                    if (!isAdmin) {
                        this.setUserStatus('user');
                    }

                    this.setToken(token);
                },
                error: () => {
                    this.setUserStatus('guest');
                },
            }),
        );
    }

    logout(): void {
        this.router.navigateByUrl('/signin');
        this.setUserStatus('guest');
        localStorage.clear();
    }

    setToken(token: string): void {
        localStorage.setItem(
            accessTokenName,
            this.userType$$.value === 'admin' ? token + ADMIN_TOKEN_SHORT_NAME : token,
        );
    }

    setUserStatus(userType: UserType): void {
        this.userType$$.next(userType);
    }
}
