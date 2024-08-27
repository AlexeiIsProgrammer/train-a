import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, EMPTY, map, switchMap } from 'rxjs';
import { Carriages } from '@type/carriages.type';
import { Carriage } from '@interface/carriage.interface';
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

export const createCarriage = createEffect(
    (actions$ = inject(Actions), httpClient = inject(HttpClient)) =>
        actions$.pipe(
            ofType(CarriageActions.addOne),
            switchMap(({ carriage }) =>
                httpClient.post<Carriage>('/api/carriage', carriage).pipe(
                    map(newCarriage => CarriageActions.addOneSuccess(newCarriage)),
                    catchError(() => EMPTY),
                ),
            ),
        ),
    { functional: true, dispatch: true },
);

export const updateCarriage = createEffect(
    (actions$ = inject(Actions), httpClient = inject(HttpClient)) =>
        actions$.pipe(
            ofType(CarriageActions.updateOne),
            switchMap(({ code, carriage }) =>
                httpClient.put<Carriage>(`/api/carriage/${code}`, carriage).pipe(
                    map(() => CarriageActions.updateOneSuccess(code, carriage)),
                    catchError(() => EMPTY),
                ),
            ),
        ),
    { functional: true, dispatch: true },
);
