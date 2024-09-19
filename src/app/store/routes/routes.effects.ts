import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, EMPTY, map, switchMap } from 'rxjs';
import { Routes } from '@type/roures.type';
import { Route } from '@interface/route.interface';
import { Router } from '@angular/router';
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
            switchMap(({ route }) => {
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
                        catchError(() => {
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
    (actions$ = inject(Actions), httpClient = inject(HttpClient), router = inject(Router)) =>
        actions$.pipe(
            ofType(RoutesActions.createCurrent),
            switchMap(({ route }) => {
                const { carriages, path } = route;

                return httpClient.post<Pick<Route, 'id'>>(`/api/route`, { carriages, path }).pipe(
                    map(({ id }) => {
                        router.navigateByUrl(`/admin/routes/${id}`);

                        return RoutesActions.addOne({ id, ...route });
                    }),
                    catchError(() => {
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
            switchMap(({ id }) =>
                httpClient.delete<Pick<Route, 'id'>>(`/api/route/${id}`).pipe(
                    map(() => RoutesActions.removeOne(id)),
                    catchError(() => {
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
