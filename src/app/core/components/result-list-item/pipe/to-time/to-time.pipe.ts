import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'toTime',
    standalone: true,
})
export class ToTimePipe implements PipeTransform {
    transform(value?: string): string {
        return value
            ? new Date(value).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
              })
            : 'No time arrival';
    }
}
