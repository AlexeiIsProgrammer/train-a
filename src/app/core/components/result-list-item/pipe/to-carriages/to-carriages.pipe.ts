import { Pipe, PipeTransform } from '@angular/core';
import { Segment } from '@type/search.type';

type CarriagePriceType = { price: number; type: string };

@Pipe({
    name: 'toCarriages',
    standalone: true,
})
export class ToCarriagesPipe implements PipeTransform {
    transform(segments: Segment[]): CarriagePriceType[] {
        return segments.reduce((acc, curr) => {
            Object.keys(curr.price).forEach(key => {
                const foundedCarriage = acc.find(carriage => carriage.type === key);

                if (foundedCarriage) {
                    foundedCarriage.price += curr.price[key];

                    acc = acc.map(carriage => (carriage.type === key ? foundedCarriage : carriage));
                } else {
                    acc.push({
                        type: key,
                        price: curr.price[key],
                    });
                }
            });

            return acc;
        }, [] as CarriagePriceType[]);
    }
}
