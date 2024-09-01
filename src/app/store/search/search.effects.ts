import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, EMPTY, map, switchMap } from 'rxjs';
import { SearchStations } from '@interface/search.interface';
import { SearchActions } from './search.actions';

export const getSearchStations = createEffect(
    (actions$ = inject(Actions), httpClient = inject(HttpClient)) =>
        actions$.pipe(
            ofType(SearchActions.loadAll),
            switchMap(params =>
                httpClient.get<SearchStations>('/api/search', {
                    params: {
                        ...params,
                    },
                }),
            ),
            map(searchStations => SearchActions.setAll(searchStations)),
            catchError(() => EMPTY),
        ),
    { functional: true, dispatch: true },
);
