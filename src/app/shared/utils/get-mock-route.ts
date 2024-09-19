import { RideDetail } from '@interface/ride.interface';

export const getMockRoute = (): RideDetail => {
    return {
        rideId: 409,
        path: [2, 69, 4],
        carriages: ['carriage2', 'carriage4', 'carriage1', 'carriage3'],
        schedule: {
            segments: [
                {
                    time: ['2024-09-21T18:26:05.205Z', '2024-09-22T01:25:05.205Z'],
                    price: { carriage2: 998, carriage4: 823, carriage1: 1353, carriage3: 1842 },
                    occupiedSeats: [],
                },
                {
                    time: ['2024-09-25T16:14:05.205Z', '2024-09-29T09:42:05.205Z'],
                    price: { carriage2: 1335, carriage4: 1143, carriage1: 2206, carriage3: 1996 },
                    occupiedSeats: [],
                },
            ],
        },
    };
};
