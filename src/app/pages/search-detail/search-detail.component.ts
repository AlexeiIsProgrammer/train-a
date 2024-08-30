/* eslint-disable rxjs/no-unsafe-takeuntil */
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
    map,
    forkJoin,
    first,
    iif,
    of,
    throwError,
    EmptyError,
    concatMap,
    catchError,
    EMPTY,
    tap,
    shareReplay,
    Observable,
    withLatestFrom,
    filter,
    take,
    takeUntil,
} from 'rxjs';
import { CommonModule } from '@angular/common';
import { GetCityNamePipe } from '@shared/pipes/get-city-name/get-city-name.pipe';
import { Store } from '@ngrx/store';
import { selectStationsEntities } from '@store/stations/stations.selectors';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { selectCarriagesEntities } from '@store/carriages/carriages.selector';
import { SearchDetailService } from './service/search-detail/search-detail.service';
import { PageParams } from './page-params.type';
import { RideInfoComponent } from './ride-info/ride-info.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { CarriageComponent } from '../../shared/components/carriage/carriage.component';

@Component({
    selector: 'app-search-detail',
    standalone: true,
    imports: [
        RideInfoComponent,
        GetCityNamePipe,
        CommonModule,
        ScheduleComponent,
        MatDialogModule,
        CarriageComponent,
    ],
    templateUrl: './search-detail.component.html',
    styleUrl: './search-detail.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [SearchDetailService],
})
export class SearchDetailComponent {
    readonly stationsEntities$ = this.store.select(selectStationsEntities);
    readonly carriagesEntities$ = this.store.select(selectCarriagesEntities).pipe(
        map(v => {
            return v['carriage1'] ?? null;
        }),
    );

    readonly pageParams$: Observable<PageParams> = forkJoin({
        rideId: this.activatedRoute.paramMap.pipe(
            first(),
            map(params => params.get('rideId')),
            concatMap(rideId =>
                iif(
                    () => Boolean(rideId),
                    of(rideId!),
                    throwError(() => EmptyError),
                ),
            ),
        ),
        query: this.activatedRoute.queryParams.pipe(
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
        ),
    }).pipe(
        catchError(() => {
            this.router.navigateByUrl('404');

            return EMPTY;
        }),
        tap(pageParams => {
            this.searchDetailService.loadRide(pageParams.rideId);
        }),
        shareReplay({ bufferSize: 1, refCount: true }),
    );

    readonly dateOfDeparture$ = this.searchDetailService.rideDetail$.pipe(
        filter(Boolean),
        withLatestFrom(this.pageParams$),
        map(([{ path, schedule }, { query }]) => {
            const cityIdx = path.slice(1).indexOf(query.to);
            const departureTime = schedule.segments.at(cityIdx)?.time.at(0);

            return departureTime ?? null;
        }),
    );

    constructor(
        private readonly store: Store,
        private readonly router: Router,
        private readonly matDialog: MatDialog,
        private readonly activatedRoute: ActivatedRoute,
        readonly searchDetailService: SearchDetailService,
    ) {}

    openDialog(): void {
        const dialogRef = this.matDialog.open(ScheduleComponent, {
            maxWidth: '500px',
            width: '100%',
        });
        const { componentRef } = dialogRef;

        dialogRef
            .afterOpened()
            .pipe(
                takeUntil(dialogRef.afterClosed()),
                withLatestFrom(
                    this.pageParams$.pipe(take(1)),
                    this.searchDetailService.schedule$.pipe(take(1)),
                    this.stationsEntities$.pipe(take(1)),
                ),
            )
            .subscribe(([, pageParams, schedule, stationsEntities]) => {
                componentRef?.setInput('schedule', schedule);
                componentRef?.setInput('pageParams', pageParams);
                componentRef?.setInput('stationsEntities', stationsEntities);
            });
    }
}
