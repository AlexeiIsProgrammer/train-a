import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthUser, UserType } from '@type/user-type.type';
import { BehaviorSubject, map, Observable, switchMap, tap } from 'rxjs';
import { serialize } from 'cookie';
import { Router } from '@angular/router';
import { accessTokenName, USER_TOKEN_SHORT_NAME } from './token-names.const';

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
    ) {}

    singUp(payLoad: AuthUser): Observable<Token> {
        return this.httpClient.post('/api/signup', payLoad).pipe(
            switchMap(() => this.logIn(payLoad)),
            tap({
                error: () => {
                    this.userType$$.next('guest');
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
                        this.userType$$.next('admin');
                    }

                    this.userType$$.next('user');

                    this.setToken(token);

                    this.router.navigateByUrl('/');
                },
                error: () => {
                    this.userType$$.next('guest');
                },
            }),
        );
    }

    setToken(token: string): void {
        const TEN_HOURS = 36000;

        document.cookie = serialize(
            accessTokenName,
            this.userType$$.value === 'user' ? USER_TOKEN_SHORT_NAME + token : token,
            {
                secure: true,
                maxAge: TEN_HOURS,
            },
        );
    }
}
