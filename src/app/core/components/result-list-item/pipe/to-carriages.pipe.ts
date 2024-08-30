import { Pipe, PipeTransform } from '@angular/core';

type CarriagePriceType = { id: number; price: number; type: string };

@Pipe({
    name: 'toCarriages',
    standalone: true,
})
export class ToCarriagesPipe implements PipeTransform {
    transform(price: { [key: string]: number }): CarriagePriceType[] {
        return Object.keys(price).map((key, index) => ({
            id: index,
            price: price[key],
            type: key,
        }));
    }
}
