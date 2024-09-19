import { Rides } from '@interface/ride.interface';

export const getMockRides = (): Rides => {
    return {
        id: 28,
        path: [69, 2, 4],
        carriages: ['carriage1', 'carriage2', 'carriage3', 'carriage4'],
        schedule: [
            {
                rideId: 103,
                segments: [
                    {
                        time: ['2024-08-15T13:27:10.000Z', '2024-08-17T16:58:10.804Z'],
                        price: {
                            carriage2: 266,
                            carriage4: 178,
                            carriage1: 114,
                            carriage3: 146,
                        },
                    },
                    {
                        time: ['2024-08-17T17:33:10.804Z', '2024-08-18T09:50:10.804Z'],
                        price: { carriage2: 225, carriage4: 659, carriage1: 568, carriage3: 893 },
                    },
                ],
            },
        ],
    };
};
