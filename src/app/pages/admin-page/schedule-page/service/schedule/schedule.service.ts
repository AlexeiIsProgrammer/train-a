import { Injectable } from '@angular/core';
import { Rides } from '@interface/ride.interface';
import { Subject, Subscription, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable()
export class ScheduleService {
    private readonly rides = new Subject<Rides>();

    readonly schedule$ = this.rides.asObservable().pipe(map(rides => rides.schedule));

    readonly path$ = this.rides.asObservable().pipe(map(rides => rides.path));

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
