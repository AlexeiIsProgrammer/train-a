import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatGridListModule } from '@angular/material/grid-list';
import { Coordinate, SearchedRoute } from '@interface/search.interface';
import { GetCurrentCities, Segment } from '@type/search.type';
import { ToDatePipe } from './pipe/to-date.pipe';
import { ToTimePipe } from './pipe/to-time.pipe';
import { ToCarriagesPipe } from './pipe/to-carriages.pipe';

@Component({
    selector: 'app-result-list-item',
    standalone: true,
    imports: [
        MatButtonModule,
        MatIconModule,
        MatDividerModule,
        MatCardModule,
        MatGridListModule,
        MatMenuModule,
        ToDatePipe,
        ToTimePipe,
        ToCarriagesPipe,
    ],
    templateUrl: './result-list-item.component.html',
    styleUrl: './result-list-item.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResultListItemComponent implements OnInit {
    @Input() from!: Coordinate;
    @Input() to!: Coordinate;
    @Input() route!: SearchedRoute;
    @Input() getCurrentCities!: (routes: GetCurrentCities) => [string, string];

    startSegment = 0;
    endSegment = 0;

    ngOnInit(): void {
        this.startSegment = this.route.path.findIndex(
            stationId => stationId === this.from.stationId,
        );
        this.endSegment = this.route.path.findIndex(stationId => stationId === this.to.stationId);
    }

    timeLeft(startDate: string, endDate: string): string {
        const difference = new Date(endDate).getTime() - new Date(startDate).getTime();

        const totalMinutes = Math.floor(difference / 60000);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        return `${hours}h ${minutes}m`;
    }

    currentRoute(segments: Segment[]): string {
        const currentSegment = this.getCurrentSegment(segments);

        if (!currentSegment) {
            return `No current routes`;
        }

        const [city1, city2] = this.getCurrentCities({
            route1: this.route.path[currentSegment],
            route2: this.route.path[currentSegment + 1],
        });

        return `${city1} -> ${city2}`;
    }

    getCurrentSegment(segments: Segment[]): number {
        const currentDate = new Date().getTime();

        for (let i = 0; i < segments.length; i += 1) {
            const [startTime, endTime] = segments[i].time.map(time => new Date(time).getTime());

            if (currentDate >= startTime && currentDate <= endTime) {
                return i;
            }
        }

        return -1;
    }

    getCarriageCount(carriage: string): number {
        return this.route.carriages.reduce((acc, curr) => (carriage === curr ? acc + 1 : acc), 0);
    }
}
