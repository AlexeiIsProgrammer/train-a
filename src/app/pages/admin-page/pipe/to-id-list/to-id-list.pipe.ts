import { Pipe, PipeTransform } from '@angular/core';
import { ConnectedTo } from '@interface/station.interface';

@Pipe({
    name: 'toIdList',
    standalone: true,
})
export class ToIdListPipe implements PipeTransform {
    transform(cities: ConnectedTo[]): number[] {
        return [...cities].map(({ id }) => id);
    }
}
