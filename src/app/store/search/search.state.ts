import { SearchStations } from '@interface/search.interface';
import { EntityState } from '@ngrx/entity';

export const SEARCH_FEATURE = 'search';

export type SearchState = EntityState<SearchStations>;

export type SearchInitialState = {
    searchStations: SearchStations | null;
};

export const searchInitialState: SearchInitialState = { searchStations: null };
