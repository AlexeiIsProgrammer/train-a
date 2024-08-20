import { createFeatureSelector, createSelector } from '@ngrx/store';
import { carriageAdapter, CARRIAGES_FEATURE, CarriagesState } from './carriages.state';

const { selectAll, selectIds } = carriageAdapter.getSelectors();
const carriageFeature = createFeatureSelector<CarriagesState>(CARRIAGES_FEATURE);

export const selectAllCarriages = createSelector(carriageFeature, state => selectAll(state));
export const selectCarriageTypes = createSelector(
    carriageFeature,
    state => <string[]>selectIds(state),
);
