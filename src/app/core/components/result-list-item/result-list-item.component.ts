import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatGridListModule } from '@angular/material/grid-list';
import { Coordinate, SearchedRoute } from '@interface/search.interface';
import { ToDatePipe } from './pipe/to-date.pipe';
import { ToTimePipe } from './pipe/to-time.pipe';

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
    ],
    templateUrl: './result-list-item.component.html',
    styleUrl: './result-list-item.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResultListItemComponent implements OnInit {
    @Input() from!: Coordinate;
    @Input() to!: Coordinate;
    @Input() route!: SearchedRoute;
    startSegment = 0;
    endSegment = 0;
    ngOnInit(): void {
        this.startSegment = this.route.path.findIndex(
            stationId => stationId === this.from.stationId,
        );
        this.endSegment = this.route.path.findIndex(stationId => stationId === this.to.stationId);
    }
}
