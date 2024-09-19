export const getMockCarriages = () => {
    return {
        carriages: {
            ids: ['carriage1', 'carriage2', 'carriage3', 'carriage4'],
            entities: {
                carriage1: {
                    code: 'carriage1',
                    name: 'carriage1',
                    rows: 11,
                    leftSeats: 3,
                    rightSeats: 2,
                },
                carriage2: {
                    code: 'carriage2',
                    name: 'carriage2',
                    rows: 16,
                    leftSeats: 3,
                    rightSeats: 1,
                },
                carriage3: {
                    code: 'carriage3',
                    name: 'carriage3',
                    rows: 20,
                    leftSeats: 2,
                    rightSeats: 2,
                },
                carriage4: {
                    code: 'carriage4',
                    name: 'carriage4',
                    rows: 20,
                    leftSeats: 3,
                    rightSeats: 3,
                },
            },
        },
    };
};
