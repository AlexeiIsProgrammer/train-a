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
} from 'rxjs';
import { CommonModule } from '@angular/common';
import { GetCityNamePipe } from '@shared/pipes/get-city-name/get-city-name.pipe';
import { Store } from '@ngrx/store';
import { selectStationsEntities } from '@store/stations/stations.selectors';
import { SearchDetailService } from './service/search-detail/search-detail.service';
import { PageParams } from './page-params.type';
import { RideInfoComponent } from './ride-info/ride-info.component';

@Component({
    selector: 'app-search-detail',
    standalone: true,
    imports: [RideInfoComponent, GetCityNamePipe, CommonModule],
    templateUrl: './search-detail.component.html',
    styleUrl: './search-detail.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [SearchDetailService],
})
export class SearchDetailComponent {
    readonly stationsEntities$ = this.store.select(selectStationsEntities);
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

    constructor(
        readonly searchDetailService: SearchDetailService,
        private readonly activatedRoute: ActivatedRoute,
        private readonly store: Store,
        private readonly router: Router,
    ) {}

    dateOfDeparture$ = this.searchDetailService.rideDetail$.pipe(
        filter(Boolean),
        withLatestFrom(this.pageParams$),
        map(([{ path, schedule }, { query }]) => {
            const cityIdx = path.slice(1).indexOf(query.to);
            const departureTime = schedule.segments.at(cityIdx)?.time.at(0);

            return departureTime ?? null;
        }),
    );
}
