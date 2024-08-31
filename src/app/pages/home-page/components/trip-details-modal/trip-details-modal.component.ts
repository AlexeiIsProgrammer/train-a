import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { Station } from '@interface/station.interface';
import { Segment } from '@type/search.type';
import { TimeArrivalPipe } from './pipe/time-arrival.pipe';
import { ToTimePipe } from './pipe/to-time.pipe';

@Component({
    selector: 'app-trip-details-modal',
    standalone: true,
    imports: [
        MatDialogModule,
        MatIconModule,
        MatButtonModule,
        MatTableModule,
        TimeArrivalPipe,
        ToTimePipe,
    ],
    templateUrl: './trip-details-modal.component.html',
    styleUrl: './trip-details-modal.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TripDetailsModalComponent implements OnInit {
    readonly dialogRef = inject(MatDialogRef<TripDetailsModalComponent>);

    @Input() routeId: number | undefined;
    @Input() path: number[] | undefined;
    @Input() segments!: Segment[];
    @Input() stationList: Station[] | undefined;

    displayedColumns: string[] = ['time', 'station', 'stop'];
    dataSource: number[] = [];

    ngOnInit(): void {
        this.dataSource = this.path || [];
    }

    close(): void {
        this.dialogRef.close();
    }

    getCity(path: number): string {
        if (!this.stationList) {
            return '';
        }

        const foundedCity = this.stationList.find(station => station.id === path);

        return foundedCity ? foundedCity.city : '';
    }
}
