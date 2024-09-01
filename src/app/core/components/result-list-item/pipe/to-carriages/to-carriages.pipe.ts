import { Pipe, PipeTransform } from '@angular/core';
import { Carriage } from '@interface/carriage.interface';
import { Segment } from '@type/search.type';

type CarriagesTrain = { carriage: string; seatsCount: number };

type CarriagePriceType = { price: number; type: string; count: number };

@Pipe({
    name: 'toCarriages',
    standalone: true,
})
export class ToCarriagesPipe implements PipeTransform {
    transform(
        segments: Segment[],
        carriageList: Carriage[] | undefined,
        carriages: string[],
    ): CarriagePriceType[] {
        const trainCarriages = carriages.reduce((acc, carriage) => {
            const currentCarriage = carriageList?.find(type => type.code === carriage);

            if (!currentCarriage) {
                acc.push({
                    carriage,
                    seatsCount: 0,
                });

                return acc;
            }

            acc.push({
                carriage,
                seatsCount:
                    (currentCarriage.leftSeats + currentCarriage.rightSeats) *
                        currentCarriage.rows +
                    (acc.at(-1)?.seatsCount || 0),
            });

            return acc;
        }, [] as CarriagesTrain[]);

        const carriagePrices = segments.reduce((acc, curr) => {
            Object.keys(curr.price).forEach(key => {
                const foundedCarriage = acc.find(carriage => carriage.type === key);

                if (foundedCarriage) {
                    foundedCarriage.price += curr.price[key];

                    acc = acc.map(carriage => (carriage.type === key ? foundedCarriage : carriage));
                } else {
                    acc.push({
                        type: key,
                        price: curr.price[key],
                        count: trainCarriages.reduce((acc, trainCarriage) => {
                            if (trainCarriage.carriage === key) {
                                const occupiedCarriageCount = curr.occupiedSeats.reduce(
                                    (seatAcc, seat) => {
                                        if (seat <= trainCarriage.seatsCount) {
                                            seatAcc += 1;
                                        }

                                        return seatAcc;
                                    },
                                    0,
                                );

                                acc += trainCarriage.seatsCount - occupiedCarriageCount;
                            }

                            return acc;
                        }, 0),
                    });
                }
            });

            return acc;
        }, [] as CarriagePriceType[]);

        return carriagePrices;
    }
}
