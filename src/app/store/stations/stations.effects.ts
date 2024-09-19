import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, EMPTY, map, switchMap, tap } from 'rxjs';
import { StationList } from '@type/station.type';
import { SnackBarMassageService } from '@shared/service/snack-bar-massage/snack-bar-massage.service';
import { StationsActions } from './stations.actions';

export const getAllStations = createEffect(
    (actions$ = inject(Actions), httpClient = inject(HttpClient)) =>
        actions$.pipe(
            ofType(StationsActions.loadAll),
            switchMap(() =>
                httpClient.get<StationList>('/api/station').pipe(
                    map(stations => StationsActions.setAll(stations)),
                    catchError(() => EMPTY),
                ),
            ),
        ),
    { functional: true, dispatch: true },
);

export const createStation = createEffect(
    (
        actions$ = inject(Actions),
        httpClient = inject(HttpClient),
        snackBar = inject(SnackBarMassageService),
    ) =>
        actions$.pipe(
            ofType(StationsActions.createOne),
            switchMap(station =>
                httpClient.post<{ id: number }>('/api/station', station).pipe(
                    tap(() => {
                        snackBar.open(`Station "${station.city}" was created`, false);
                    }),
                    map(() => StationsActions.loadAll()),
                    catchError(() => EMPTY),
                ),
            ),
        ),
    { functional: true, dispatch: true },
);

export const removeStation = createEffect(
    (
        actions$ = inject(Actions),
        httpClient = inject(HttpClient),
        snackBar = inject(SnackBarMassageService),
    ) =>
        actions$.pipe(
            ofType(StationsActions.removeOne),
            switchMap(({ id }) =>
                httpClient.delete<{ id: number }>(`/api/station/${id}`).pipe(
                    tap({
                        next: () => {
                            snackBar.open('Station was deleted', false);
                        },
                        error: () => {
                            snackBar.open('Cannot delete station with active rides', true);
                        },
                    }),
                ),
            ),
            map(res => StationsActions.removeOneSuccess(res.id)),
        ),
    { functional: true, dispatch: true },
);
