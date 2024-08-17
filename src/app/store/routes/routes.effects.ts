import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, EMPTY, map, switchMap } from 'rxjs';
import { Routes } from '@type/roures.type';
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
