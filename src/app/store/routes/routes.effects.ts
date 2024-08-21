import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, EMPTY, map, switchMap } from 'rxjs';
import { Routes } from '@type/roures.type';
import { Route } from '@interface/route.interface';
import { RoutesActions } from './routes.actions';

export const getAllRoutes = createEffect(
    (actions$ = inject(Actions), httpClient = inject(HttpClient)) =>
        actions$.pipe(
            ofType(RoutesActions.loadAll),
            switchMap(() => httpClient.get<Routes>('/api/route')),
            map(routes => RoutesActions.setAll(routes)),
            catchError(() => EMPTY),
        ),
    {
        functional: true,
        dispatch: true,
    },
);

export const updateRoute = createEffect(
    (actions$ = inject(Actions), httpClient = inject(HttpClient)) =>
        actions$.pipe(
            ofType(RoutesActions.updateCurrent),
            switchMap(({ route, err }) => {
                const { id, carriages, path } = route;

                return httpClient
                    .put<Pick<Route, 'id'>>(`/api/route/${id}`, { carriages, path })
                    .pipe(
                        map(() =>
                            RoutesActions.updateOne({
                                id,
                                changes: {
                                    carriages,
                                    path,
                                },
                            }),
                        ),
                        catchError((errMgs: unknown) => {
                            err(errMgs);

                            return EMPTY;
                        }),
                    );
            }),
        ),
    {
        functional: true,
        dispatch: true,
    },
);

export const createRoute = createEffect(
    (actions$ = inject(Actions), httpClient = inject(HttpClient)) =>
        actions$.pipe(
            ofType(RoutesActions.createCurrent),
            switchMap(({ route, err }) => {
                const { carriages, path } = route;

                return httpClient.post<Pick<Route, 'id'>>(`/api/route`, { carriages, path }).pipe(
                    map(({ id }) => RoutesActions.addOne({ id, ...route })),
                    catchError((errMgs: unknown) => {
                        err(errMgs);

                        return EMPTY;
                    }),
                );
            }),
        ),
    {
        functional: true,
        dispatch: true,
    },
);

export const removeRoute = createEffect(
    (actions$ = inject(Actions), httpClient = inject(HttpClient)) =>
        actions$.pipe(
            ofType(RoutesActions.removeCurrent),
            switchMap(({ id, err }) =>
                httpClient.delete<Pick<Route, 'id'>>(`/api/route/${id}`).pipe(
                    map(() => RoutesActions.removeOne(id)),
                    catchError((errMgs: unknown) => {
                        err(errMgs);

                        return EMPTY;
                    }),
                ),
            ),
        ),
    {
        functional: true,
        dispatch: true,
    },
);
