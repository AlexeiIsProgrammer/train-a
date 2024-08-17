import { ROUTES_FEATURE } from './routes/roures.state';
import { routesReducer } from './routes/routes.reducer';
import { stationReducer } from './stations/stations.reducer';
import { STATIONS_FEATURE } from './stations/stations.state';

export const storeReducer = {
    [STATIONS_FEATURE]: stationReducer,
    [ROUTES_FEATURE]: routesReducer,
} as const;
