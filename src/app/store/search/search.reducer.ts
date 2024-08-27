import { createReducer, on } from '@ngrx/store';
import { SearchActions } from './search.actions';
import { searchAdapter, searchInitialState } from './search.state';

export const searchReducer = createReducer(
    searchInitialState,
    on(SearchActions.setAll, (state, { searchStations }) =>
        searchAdapter.addOne(searchStations, state),
    ),
);
