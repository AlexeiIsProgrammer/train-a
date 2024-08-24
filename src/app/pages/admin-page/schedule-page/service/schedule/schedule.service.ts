import { Injectable } from '@angular/core';
import { Rides } from '@interface/ride.interface';
import { BehaviorSubject, Subscription, map, filter } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable()
export class ScheduleService {
    private readonly rides = new BehaviorSubject<Rides | null>(null);

    readonly schedule$ = this.rides.asObservable().pipe(
        filter(Boolean),
        map(({ schedule }) => schedule),
    );

    readonly path$ = this.rides.asObservable().pipe(
        filter(Boolean),
        map(({ path }) => path),
    );

    constructor(
        readonly httpClient: HttpClient,
        private readonly router: Router,
    ) {}

    private rideSubscription: Subscription | null = null;

    loadSchedule(id: number) {
        if (this.rideSubscription) {
            this.rideSubscription.unsubscribe();
        }

        this.rideSubscription = this.httpClient.get<Rides>(`/api/route/${id}`).subscribe({
            next: rides => {
                // console.log(rides)
                this.rides.next(rides);
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
