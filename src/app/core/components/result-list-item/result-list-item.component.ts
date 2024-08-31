import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatGridListModule } from '@angular/material/grid-list';
import { Coordinate, SearchedRoute } from '@interface/search.interface';
import { GetCurrentCities, Segment } from '@type/search.type';
import { MatDialog } from '@angular/material/dialog';
import { TripDetailsModalComponent } from '@pages/home-page/components/trip-details-modal/trip-details-modal.component';
import { Station } from '@interface/station.interface';
import { Router, RouterLink } from '@angular/router';
import { Carriage } from '@interface/carriage.interface';
import { ToDatePipe } from '../../../shared/pipes/to-date/to-date.pipe';
import { ToTimePipe } from './pipe/to-time/to-time.pipe';
import { ToCarriagesPipe } from './pipe/to-carriages/to-carriages.pipe';

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
        RouterLink,
    ],
    templateUrl: './result-list-item.component.html',
    styleUrl: './result-list-item.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResultListItemComponent implements OnInit {
    @Input() from!: Coordinate;
    @Input() to!: Coordinate;
    @Input() route!: SearchedRoute;
    @Input() stationList: Station[] | undefined;
    @Input() carriageList: Carriage[] | undefined;

    startSegment = 0;
    endSegment = 0;

    constructor(
        private readonly matDialog: MatDialog,
        private readonly router: Router,
    ) {}

    ngOnInit(): void {
        this.startSegment = this.route.path.findIndex(
            stationId => stationId === this.from.stationId,
        );
        this.endSegment = this.route.path.findIndex(stationId => stationId === this.to.stationId);
    }

    timeLeft(startDate: string, endDate: string): string {
        const difference = new Date(endDate).getTime() - new Date(startDate).getTime();

        const totalMinutes = Math.floor(difference / 60000);
        const days = Math.floor(totalMinutes / 60 / 24);
        const hours = Math.floor(totalMinutes / 60) % 24;
        const minutes = totalMinutes % 60;

        return `${days > 0 ? `${days}d ` : ''}${hours}h ${minutes}m`;
    }

    currentRoute(segments: Segment[]): string {
        const currentSegment = this.getCurrentSegment(segments);

        if (currentSegment === -1) {
            return `No current routes`;
        }

        const getCurrentCities = ({ route1, route2 }: GetCurrentCities): [string, string] => {
            if (!this.stationList) {
                return ['City is not loaded', 'City is not loaded'];
            }

            return [
                this.stationList?.find(station => station.id === route1)?.city || '',
                this.stationList?.find(station => station.id === route2)?.city || '',
            ];
        };

        const [city1, city2] = getCurrentCities({
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

    // getCarriageCount(carriage: string, occupiedSeats: number[], carriages: string[]): number {
    //     const currentCarriage = this.carriageList?.find(type => type.code === carriage);

    //     if (!currentCarriage) {
    //         return 0;
    //     }

    //     const seatsPerCarriage =
    //         (currentCarriage.leftSeats + currentCarriage.rightSeats) * currentCarriage.rows;

    //     return 0;
    // }

    openDialog(segments: Segment[], path: number[], routeId: number): void {
        const dialogRef = this.matDialog.open(TripDetailsModalComponent, {
            height: '90vh',
            maxWidth: '1440px',
        });
        const { componentInstance } = dialogRef;

        componentInstance.routeId = routeId;
        componentInstance.path = path;
        componentInstance.segments = segments;
        componentInstance.stationList = this.stationList;
    }

    onCardClick(event: MouseEvent, rideId: number): void {
        const target = event.target as HTMLElement;

        if (!target.closest('button')) {
            this.router.navigate(['/trip', rideId], {
                queryParams: { from: this.from.stationId, to: this.to.stationId },
            });
        }
    }
}
