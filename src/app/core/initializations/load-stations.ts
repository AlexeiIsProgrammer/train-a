import { Store } from '@ngrx/store';
import { CarriageActions } from '@store/carriages/carriages.actions';
import { StationsActions } from '@store/stations/stations.actions';

export const loadStations = (store: Store) => () => {
    store.dispatch(StationsActions.loadAll());
    store.dispatch(CarriageActions.loadAll());
};
