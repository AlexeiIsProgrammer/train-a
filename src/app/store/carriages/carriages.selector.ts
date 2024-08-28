import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CARRIAGES_FEATURE, carriageAdapter, CarriagesState } from './carriages.state';

const { selectAll, selectEntities } = carriageAdapter.getSelectors();
const carriagesFeature = createFeatureSelector<CarriagesState>(CARRIAGES_FEATURE);

export const selectAllCarriages = createSelector(carriagesFeature, state => selectAll(state));
export const selectCarriagesEntities = createSelector(carriagesFeature, state =>
    selectEntities(state),
);
