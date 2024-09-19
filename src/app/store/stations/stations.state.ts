import { Station } from '@interface/station.interface';
import { createEntityAdapter, EntityState } from '@ngrx/entity';

export const STATIONS_FEATURE = 'stations';

export type StationsState = EntityState<Station>;

export const stationsAdapter = createEntityAdapter<Station>();

export const stationsInitialState = stationsAdapter.getInitialState({
    ids: [],
    entities: {},
});
