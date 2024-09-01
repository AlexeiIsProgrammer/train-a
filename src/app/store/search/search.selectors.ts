import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SEARCH_FEATURE, SearchState } from './search.state';

const searchFeature = createFeatureSelector<SearchState>(SEARCH_FEATURE);

export const selectSearchStations = createSelector(searchFeature, state => state.searchStations);
