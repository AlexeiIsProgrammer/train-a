import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'isSeatFree',
    standalone: true,
})
export class IsSeatFreePipe implements PipeTransform {
    transform(seatNum: number, occupiedSeats: number[]): boolean {
        return !occupiedSeats.includes(seatNum);
    }
}
