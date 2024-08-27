import { SearchStations } from '@interface/search.interface';
import { createEntityAdapter, EntityState } from '@ngrx/entity';

export const SEARCH_FEATURE = 'search';

export type SearchState = EntityState<SearchStations>;

export const searchAdapter = createEntityAdapter<SearchStations>();

export const searchInitialState = searchAdapter.getInitialState();
