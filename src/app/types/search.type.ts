export type Geolocation = {
    latitude: number;
    longitude: number;
};

export type Segment = {
    time: string[];
    price: {
        'dynamic-carriage-type-1': number;
    };
    occupiedSeats: number[];
};
