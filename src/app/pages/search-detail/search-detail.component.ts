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
} from 'rxjs';
import { PageParams } from './page-params.type';
import { SearchDetailService } from './search-detail/search-detail.service';

@Component({
    selector: 'app-search-detail',
    standalone: true,
    imports: [],
    templateUrl: './search-detail.component.html',
    styleUrl: './search-detail.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [SearchDetailService],
})
export class SearchDetailComponent {
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
        private readonly router: Router,
    ) {}
}
