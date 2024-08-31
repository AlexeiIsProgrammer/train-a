import { Pipe, PipeTransform } from '@angular/core';
import { Segment } from '@type/search.type';

@Pipe({
    name: 'toTime',
    standalone: true,
})
export class ToTimePipe implements PipeTransform {
    transform(time: string[], index: number, dataSource: Segment[]): string {
        if (index === 0) {
            return new Date(time[0]).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
            });
        }

        if (index === dataSource.length) {
            return new Date(time[1]).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
            });
        }

        const [timeStart, timeEnd] = [dataSource[index - 1].time[1], time[0]].map(timePart =>
            new Date(timePart).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
            }),
        );

        return `${timeStart} - ${timeEnd}`;
    }
}
