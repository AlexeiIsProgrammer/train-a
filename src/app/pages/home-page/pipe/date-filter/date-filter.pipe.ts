import { Pipe, PipeTransform } from '@angular/core';
import { SearchedRoute } from '@interface/search.interface';

@Pipe({
    name: 'dateFilter',
    standalone: true,
})
export class DateFilterPipe implements PipeTransform {
    transform(routes: SearchedRoute[], selectedDay: string, stationId: number): SearchedRoute[] {
        return routes.map(route => ({
            ...route,
            schedule: route.schedule.filter(
                day =>
                    new Date(
                        day.segments[route.path.findIndex(way => way === stationId)].time[0],
                    ).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                    }) === selectedDay,
            ),
        }));
    }
}
