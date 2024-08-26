import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SEARCH_FEATURE, SearchState } from './search.state';

const searchFeature = createFeatureSelector<SearchState>(SEARCH_FEATURE);

export const selectAllSearchStations = createSelector(searchFeature, state => state);
