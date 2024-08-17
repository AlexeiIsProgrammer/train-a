import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ROUTES_FEATURE, routesAdapter, RoutesState } from './roures.state';

const routesFeature = createFeatureSelector<RoutesState>(ROUTES_FEATURE);
const { selectAll, selectEntities } = routesAdapter.getSelectors();

export const selectAllRoutes = createSelector(routesFeature, state => selectAll(state));

export const selectRoutesEntities = createSelector(routesFeature, state => selectEntities(state));
