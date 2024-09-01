import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserProfile } from '@type/profile.type';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ProfileService {
    constructor(readonly httpClient: HttpClient) {}

    getProfile(): Observable<UserProfile> {
        return this.httpClient.get<UserProfile>(`/api/profile`);
    }

    updateProfile(body: Omit<UserProfile, 'role'>): Observable<UserProfile> {
        return this.httpClient.put<UserProfile>(`/api/profile`, body);
    }

    updatePassword(newPassword: string): Observable<unknown> {
        return this.httpClient.put<unknown>(`/api/profile/password`, { password: newPassword });
    }
}
