import { Pipe, PipeTransform } from '@angular/core';
import { Station } from '@interface/station.interface';
import { StationList } from '@type/station.type';

@Pipe({
    name: 'filter',
    standalone: true,
})
export class FilterPipe implements PipeTransform {
    transform(
        stationList: StationList | undefined,
        cityValue: string | Station | undefined | null,
    ): StationList {
        const value: string = (
            typeof cityValue === 'string' ? cityValue : cityValue?.city || ''
        ).toLowerCase();

        return stationList?.filter(option => option.city.toLowerCase().includes(value)) || [];
    }
}
