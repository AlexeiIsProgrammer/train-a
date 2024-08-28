import { createReducer, on } from '@ngrx/store';
import { Carriage } from '@interface/carriage.interface';
import { carriageAdapter, carriageInitialState } from './carriages.state';
import { CarriageActions } from './carriages.actions';

export const carriageReducer = createReducer(
    carriageInitialState,
    on(CarriageActions.setAll, (state, { carriages }) => carriageAdapter.setAll(carriages, state)),
    on(CarriageActions.addOne, (state, { carriage }) => {
        const existingCarriages = state.ids
            .map(id => state.entities[id])
            .filter((c): c is Carriage => c !== undefined);

        const updatedCarriages = [carriage, ...existingCarriages];

        return carriageAdapter.setAll(updatedCarriages, state);
    }),
    on(CarriageActions.updateOneSuccess, (state, { code, changes }) =>
        carriageAdapter.updateOne({ id: code, changes }, state),
    ),
);
