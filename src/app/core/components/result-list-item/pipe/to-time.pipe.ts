import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'toTime',
    standalone: true,
})
export class ToTimePipe implements PipeTransform {
    transform(value?: string): string {
        return value ? new Date(value).toLocaleTimeString() : 'No time arrival';
    }
}
