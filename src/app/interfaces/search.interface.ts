import { Geolocation, Segment } from '@type/search.type';
import { Route } from './route.interface';

export interface Search {
    time: number;
    fromLatitude: number;
    fromLongitude: number;
    toLatitude: number;
    toLongitude: number;
}

export interface Coordinate {
    stationId: number;
    city: string;
    geolocation: Geolocation;
}

export interface Schedule {
    rideId: number;
    segments: Segment[];
}

export interface SearchedRoute extends Route {
    id: number;
    path: number[];
    carriages: string[];
    schedule: Schedule[];
}

export interface SearchStations {
    from: Coordinate;
    to: Coordinate;
    routes: SearchedRoute[];
}
