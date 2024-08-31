import { Pipe, PipeTransform } from '@angular/core';
import { SearchedRoute } from '@interface/search.interface';

@Pipe({
    name: 'toDateTabs',
    standalone: true,
})
export class ToDateTabsPipe implements PipeTransform {
    transform(routes: SearchedRoute[], stationId: number): string[] {
        return Array.from(
            routes.reduce((acc, curr) => {
                curr.schedule.forEach(ride => {
                    acc.add(
                        ride.segments[curr.path.findIndex(way => way === stationId)].time[0].split(
                            'T',
                        )[0],
                    );
                });

                return acc;
            }, new Set<string>()),
        ).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    }
}
