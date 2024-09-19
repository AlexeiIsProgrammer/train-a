import { Station } from '@interface/station.interface';

export const getMockStationEntity = (): Record<string, Station> => {
    return {
        '2': {
            id: 2,
            city: 'city2',
            latitude: 80.81300189793322,
            longitude: -99.36116483933587,
            connectedTo: [
                {
                    id: 69,
                    distance: 10,
                },
                {
                    id: 4,
                    distance: 10,
                },
            ],
        },
        '69': {
            id: 69,
            city: 'city69',
            latitude: 80.81300189793322,
            longitude: -99.36116483933587,
            connectedTo: [
                {
                    id: 2,
                    distance: 10,
                },
                {
                    id: 4,
                    distance: 10,
                },
            ],
        },
        '4': {
            id: 4,
            city: 'city4',
            latitude: 80.81300189793322,
            longitude: -99.36116483933587,
            connectedTo: [
                {
                    id: 69,
                    distance: 10,
                },
                {
                    id: 4,
                    distance: 10,
                },
            ],
        },
    };
};
