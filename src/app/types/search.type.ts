export type Geolocation = {
    latitude: number;
    longitude: number;
};

export type Segment = {
    time: [string, string];
    price: {
        [key: string]: number;
    };
    occupiedSeats: number[];
};

export type GetCurrentCities = { route1: number; route2: number };
