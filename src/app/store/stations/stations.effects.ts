import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, EMPTY, map, switchMap } from 'rxjs';
import { StationList } from '@type/station.type';
import { StationsActions } from './stations.actions';

export const getAllStations = createEffect(
    (actions$ = inject(Actions), httpClient = inject(HttpClient)) =>
        actions$.pipe(
            ofType(StationsActions.loadAll),
            switchMap(() => httpClient.get<StationList>('/api/station')),
            map(stations => StationsActions.setAll(stations)),
            catchError(() => EMPTY),
        ),
    { functional: true, dispatch: true },
);
