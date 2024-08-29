import { Pipe, PipeTransform } from '@angular/core';
import { Station } from '@interface/station.interface';
import { Dictionary } from '@ngrx/entity';

@Pipe({
    name: 'getCityName',
    standalone: true,
})
export class GetCityNamePipe implements PipeTransform {
    transform(
        stationID: number | number[] | null | undefined,
        stationEntities: Dictionary<Station> | null | undefined,
    ): string[] | string | undefined {
        if (!stationEntities || !stationID) {
            return undefined;
        }

        if (stationID instanceof Array) {
            const cities = stationID.reduce((acc: string[], id) => {
                const cityName = stationEntities[Number(id)]?.city ?? '';

                acc.push(cityName);

                return acc;
            }, []);

            return cities;
        }

        const cityName = stationEntities[stationID]?.city;

        return cityName;
    }
}
