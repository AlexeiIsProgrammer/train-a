import { Pipe, PipeTransform } from '@angular/core';
import { Station } from '@interface/station.interface';
import { Dictionary } from '@ngrx/entity';

@Pipe({
    name: 'getConnectedCity',
    standalone: true,
})
export class GetConnectedCityPipe implements PipeTransform {
    transform(
        connectedTo: number[],
        stationEntities: Dictionary<Station> | undefined | null,
    ): string[] {
        if (!stationEntities) {
            return [];
        }

        const cities = connectedTo.reduce((acc: string[], id) => {
            const cityName = stationEntities[id]?.city ?? '';

            acc.push(cityName);

            return acc;
        }, []);

        return cities;
    }
}
