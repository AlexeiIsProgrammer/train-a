import { createReducer, on } from '@ngrx/store';
import { routesAdapter, routesInitialState } from './roures.state';
import { RoutesActions } from './routes.actions';

export const routesReducer = createReducer(
    routesInitialState,
    on(RoutesActions.setAll, (state, { routes }) => routesAdapter.setAll(routes, state)),
    on(RoutesActions.updateOne, (state, { update }) => routesAdapter.updateOne(update, state)),
);
