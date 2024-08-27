import { Injectable } from '@angular/core';
import { Ride, Rides } from '@interface/ride.interface';
import { BehaviorSubject, Subscription, map, filter, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { remove, uniq } from 'lodash';

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

    readonly carriages$ = this.rides.asObservable().pipe(
        filter(Boolean),
        map(({ carriages }) => uniq(carriages)),
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

    updateRide(rideId: number, segments: Ride['segments']): Observable<unknown> {
        return this.httpClient.put<unknown>(`/api/route/${this.id}/ride/${rideId}`, { segments });
    }

    removeById(id: number): Observable<unknown> {
        return this.httpClient.delete<unknown>(`/api/route/${id}`);
    }

    createRide(segments: Ride['segments']) {
        return this.httpClient.post<unknown>(`/api/route/${this.id}/ride`, { segments });
    }

    fakeRideRemove(id: number): void {
        const rides = this.rides.value;

        if (rides) {
            this.rides.next({
                ...rides,
                schedule: remove(rides.schedule, ({ rideId }) => rideId !== id),
            });
        }
    }

    get id() {
        return this.rides.value?.id ?? NaN;
    }
}
