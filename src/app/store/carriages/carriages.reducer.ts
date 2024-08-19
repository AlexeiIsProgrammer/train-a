import { createReducer, on } from '@ngrx/store';
import { carriageAdapter, carriageInitialState } from './carriages.state';
import { CarriageActions } from './carriages.actions';

export const carriageReducer = createReducer(
    carriageInitialState,
    on(CarriageActions.setAll, (state, { carriages }) => carriageAdapter.setAll(carriages, state)),
);
