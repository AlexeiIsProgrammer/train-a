import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthUser, UserType } from '@type/user-type.type';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private readonly userType$$ = new BehaviorSubject<UserType>('guest');
    readonly userType$ = this.userType$$.asObservable();

    constructor(private readonly httpClient: HttpClient) {}

    singUp(payLoad: AuthUser) {
        return this.httpClient.post('/api/signup', payLoad);
    }
}
