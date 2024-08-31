import { Pipe, PipeTransform } from '@angular/core';
import { Segment } from '@type/search.type';

@Pipe({
    name: 'timeArrival',
    standalone: true,
})
export class TimeArrivalPipe implements PipeTransform {
    transform(time: [string, string], index: number, dataSource: Segment[]): string {
        if (index === 0) {
            return 'first station';
        }

        if (index === dataSource.length) {
            return 'last station';
        }

        return `${new Date(
            new Date(time[0]).getTime() - new Date(dataSource[index - 1].time[1]).getTime(),
        ).toLocaleTimeString('en-US', {
            minute: '2-digit',
            hour12: false,
        })} m`;
    }
}
