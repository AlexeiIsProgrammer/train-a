import { Route } from './route.interface';

export interface Search {
    time?: number;
    fromLatitude: number;
    fromLongitude: number;
    toLatitude: number;
    toLongitude: number;
}

export type Geolocation = {
    latitude: number;
    longitude: number;
};

export interface Coordinate {
    stationId: number;
    city: string;
    geolocation: Geolocation;
}

export type Segment = {
    time: string[];
    price: {
        'dynamic-carriage-type-1': number;
    };
    occupiedSeats: number[];
};

export interface Schedule {
    rideId: number;
    segments: Segment[];
}

export interface SearchedRoute extends Route {
    schedule: Schedule[];
}

export interface SearchStations {
    from: Coordinate;
    to: Coordinate;
    routes: SearchedRoute[];
}
