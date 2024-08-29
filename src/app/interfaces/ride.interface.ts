export interface RideSegment {
    time: string[];
    price: Record<string, number>;
}

export interface Ride {
    rideId: number;
    segments: RideSegment[];
}
export interface Rides {
    id: number;
    path: number[];
    carriages: string[];
    schedule: Ride[];
}

export interface RideDetailSegments {
    segments: Array<RideSegment & { occupiedSeats: number[] }>;
}
export interface RideDetail {
    rideId: number;
    path: number[];
    carriages: string[];
    schedule: RideDetailSegments;
}
