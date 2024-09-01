import { SearchStations } from '@interface/search.interface';

export const SEARCH_FEATURE = 'search';

export type SearchState = {
    searchStations?: SearchStations;
};

export const searchInitialState: SearchState = {};
