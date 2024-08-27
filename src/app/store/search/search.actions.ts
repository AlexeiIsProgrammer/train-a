import { Search, SearchStations } from '@interface/search.interface';
import { createActionGroup, props } from '@ngrx/store';

export const SearchActions = createActionGroup({
    source: 'Search',
    events: {
        'Load all': props<Search>(),
        'Set all': (searchStations: SearchStations) => ({ searchStations }),
    },
});
