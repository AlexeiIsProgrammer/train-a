import { Search, SearchStations } from '@interface/search.interface';
import { createActionGroup, props } from '@ngrx/store';

export const SearchActions = createActionGroup({
    source: 'Search',
    events: {
        'Search all': props<Search>(),
        'Set all': (searchStations: SearchStations) => ({ searchStations }),
    },
});
