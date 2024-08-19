import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, EMPTY, map, switchMap } from 'rxjs';
import { Carriages } from '@type/carriages.type';
import { CarriageActions } from './carriages.actions';

export const getAllCarriages = createEffect(
    (actions$ = inject(Actions), httpClient = inject(HttpClient)) =>
        actions$.pipe(
            ofType(CarriageActions.loadAll),
            switchMap(() => httpClient.get<Carriages>('/api/carriage')),
            map(carriages => CarriageActions.setAll(carriages)),
            catchError(() => EMPTY),
        ),
    { functional: true, dispatch: true },
);
