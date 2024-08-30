import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { RideDetail } from '@interface/ride.interface';
import { mapToSchedule } from '@pages/search-detail/utils/map-to-schedule';

import { BehaviorSubject, filter, map, Subscription } from 'rxjs';

@Injectable()
export class SearchDetailService {
    private readonly rideDetail$$ = new BehaviorSubject<RideDetail | null>(null);

    readonly rideDetail$ = this.rideDetail$$.asObservable();

    readonly schedule$ = this.rideDetail$$.pipe(
        filter(Boolean),
        map(({ path, schedule }) => mapToSchedule(path, schedule)),
    );

    constructor(
        private readonly router: Router,
        private readonly httpClient: HttpClient,
    ) {}

    private rideSubscription: Subscription | null = null;

    loadRide(rideId: string): void {
        if (this.rideSubscription) {
            this.rideSubscription.unsubscribe();
        }

        this.rideSubscription = this.httpClient.get<RideDetail>(`/api/search/${rideId}`).subscribe({
            next: rideDetail => {
                this.rideDetail$$.next(rideDetail);
            },
            complete: () => {
                this.rideSubscription = null;
            },
            error: () => {
                this.router.navigateByUrl('404');
            },
        });
    }
}
