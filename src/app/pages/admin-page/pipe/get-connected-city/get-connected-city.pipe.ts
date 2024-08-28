import { Pipe, PipeTransform } from '@angular/core';
import { Station } from '@interface/station.interface';
import { Dictionary } from '@ngrx/entity';

@Pipe({
    name: 'getConnectedCity',
    standalone: true,
})
export class GetConnectedCityPipe implements PipeTransform {
    transform(
        connectedTo: Array<number | undefined>,
        stationEntities: Dictionary<Station> | undefined | null,
    ): string[] {
        if (!stationEntities || !connectedTo) {
            return [];
        }

        const cities = connectedTo.reduce((acc: string[], id) => {
            const cityName = stationEntities[Number(id)]?.city ?? '';

            acc.push(cityName);

            return acc;
        }, []);

        return cities;
    }
}
