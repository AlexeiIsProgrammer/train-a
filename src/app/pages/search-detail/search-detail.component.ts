import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
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
} from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { GetCityNamePipe } from '@shared/pipes/get-city-name/get-city-name.pipe';
import { Store } from '@ngrx/store';
import { selectStationsEntities } from '@store/stations/stations.selectors';
import { SearchDetailService } from './search-detail/search-detail.service';
import { PageParams } from './page-params.type';

@Component({
    selector: 'app-search-detail',
    standalone: true,
    imports: [MatButtonModule, MatIconModule, AsyncPipe, GetCityNamePipe],
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
            concatMap(query =>
                iif(
                    () => query['from'] && query['to'],
                    of(<PageParams['query']>query),
                    throwError(() => EmptyError),
                ),
            ),
        ),
    }).pipe(
        catchError(() => {
            this.router.navigateByUrl('404');

            return EMPTY;
        }),
        tap(({ rideId }) => {
            this.searchDetailService.loadRide(rideId);
        }),
        shareReplay({ bufferSize: 1, refCount: true }),
    );

    constructor(
        readonly searchDetailService: SearchDetailService,
        private readonly activatedRoute: ActivatedRoute,
        private readonly store: Store,
        private readonly router: Router,
    ) {}
}
