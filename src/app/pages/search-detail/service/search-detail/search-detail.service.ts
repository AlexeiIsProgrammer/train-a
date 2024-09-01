import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RideDetail } from '@interface/ride.interface';
import { PageParams } from '@pages/search-detail/page-params.type';
import { SelectedSeat } from '@pages/search-detail/selected-seat.interface';
import { mapToSchedule } from '@pages/search-detail/utils/map-to-schedule';
import {
    BehaviorSubject,
    catchError,
    concatMap,
    EMPTY,
    EmptyError,
    filter,
    first,
    take,
    forkJoin,
    iif,
    map,
    Observable,
    of,
    shareReplay,
    Subscription,
    switchMap,
    tap,
    throwError,
    withLatestFrom,
} from 'rxjs';

@Injectable()
export class SearchDetailService {
    private readonly rideDetail$$ = new BehaviorSubject<RideDetail | null>(null);
    private readonly selectedSeat$$ = new BehaviorSubject<SelectedSeat | null>(null);

    readonly selectedSeat$ = this.selectedSeat$$.asObservable();

    readonly rideId$ = this.activatedRoute.paramMap.pipe(
        first(),
        map(params => params.get('rideId')),
        concatMap(rideId =>
            iif(
                () => Boolean(rideId),
                of(rideId!),
                throwError(() => EmptyError),
            ),
        ),
    );

    readonly query$ = this.activatedRoute.queryParams.pipe(
        first(),
        concatMap(({ from, to }) =>
            iif(
                () => {
                    const isInteger =
                        Number.isInteger(Number(from)) && Number.isInteger(Number(to));

                    return isInteger;
                },
                of({ from: Number(from), to: Number(to) }),
                throwError(() => EmptyError),
            ),
        ),
    );

    readonly pageParams$: Observable<PageParams> = forkJoin({
        rideId: this.rideId$,
        query: this.query$,
    }).pipe(
        catchError(() => {
            this.router.navigateByUrl('404');

            return EMPTY;
        }),
        tap(pageParams => {
            this.loadRide(pageParams.rideId);
        }),
        shareReplay({ bufferSize: 1, refCount: true }),
    );

    readonly schedule$ = this.rideDetail$$.pipe(
        filter(Boolean),
        map(({ path, schedule }) => mapToSchedule(path, schedule)),
    );

    readonly rideDetail$ = this.rideDetail$$.pipe(
        filter(Boolean),
        withLatestFrom(this.pageParams$),
        tap(([{ path }, { query }]) => {
            const fromIdx = Math.abs(path.indexOf(query.from));
            const toIdx = Math.abs(path.indexOf(query.to));

            if (fromIdx >= toIdx) {
                this.router.navigateByUrl('404');
            }
        }),
        switchMap(([rideDetail]) => of(rideDetail)),
    );

    private rideSubscription: Subscription | null = null;
    private makeOrderSubscription: Subscription | null = null;

    constructor(
        private readonly router: Router,
        private readonly httpClient: HttpClient,
        private readonly activatedRoute: ActivatedRoute,
        private readonly snackBar: MatSnackBar,
    ) {}

    makeOrder(): void {
        if (this.makeOrderSubscription) {
            this.makeOrderSubscription.unsubscribe();
        }

        this.makeOrderSubscription = forkJoin([
            this.selectedSeat$.pipe(filter(Boolean), take(1)),
            this.pageParams$.pipe(take(1)),
        ])
            .pipe(
                switchMap(([{ seatNum }, { query, rideId }]) =>
                    this.httpClient.post<{ id: number }>('/api/order', {
                        rideId,
                        seat: seatNum,
                        stationStart: query.from,
                        stationEnd: query.to,
                    }),
                ),
            )
            .subscribe({
                next: () => {
                    const rideId = this.rideDetail$$.value?.rideId;

                    this.loadRide(`${rideId}`);
                    this.closeReservation();

                    this.openSnackBar('Ride successfully booked', false);
                },
                complete: () => {
                    this.rideSubscription = null;
                },
                error: (err: unknown) => {
                    if (err instanceof HttpErrorResponse) {
                        this.openSnackBar(err.error.message, true);
                    }
                },
            });
    }

    openSnackBar(massage: string, isError: boolean): void {
        this.snackBar.open(`${massage}`, undefined, {
            duration: 2000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: isError ? 'snack-bar-err' : 'snack-bar-success',
        });
    }

    setSeat(seat: SelectedSeat): void {
        this.selectedSeat$$.next(seat);
    }

    closeReservation(): void {
        this.selectedSeat$$.next(null);
    }

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
