import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'getDay',
    standalone: true,
})
export class GetDayPipe implements PipeTransform {
    transform(date: string): string {
        return new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
    }
}
