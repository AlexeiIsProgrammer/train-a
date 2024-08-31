import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'toDate',
    standalone: true,
})
export class ToDatePipe implements PipeTransform {
    transform(value: string): string {
        const date = new Date(value);

        const month = date.toLocaleString('en-EN', { month: 'long' });
        const day = date.getDate();

        return value ? `${month} ${day}` : 'No date arrival';
    }
}
