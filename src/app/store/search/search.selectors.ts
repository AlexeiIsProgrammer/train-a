import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SEARCH_FEATURE, searchAdapter, SearchState } from './search.state';

const { selectEntities } = searchAdapter.getSelectors();

const searchFeature = createFeatureSelector<SearchState>(SEARCH_FEATURE);

export const selectSearchEntities = createSelector(searchFeature, state => selectEntities(state));
