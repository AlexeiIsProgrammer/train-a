import { Store } from '@ngrx/store';
import { StationsActions } from '@store/stations/stations.actions';

export const loadStations = (store: Store) => () => {
    store.dispatch(StationsActions.loadAll());
};
