import {
    ChangeDetectionStrategy,
    Component,
    input,
    viewChild,
    computed,
    output,
} from '@angular/core';
import { Station } from '@interface/station.interface';
import { Dictionary } from '@ngrx/entity';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { JoinPipe } from '@pages/admin-page/pipe/join/join.pipe';
import { ScrollToTopDirective } from '@shared/directives/scroll-to-top/scroll-to-top.directive';
import { ToIdListPipe } from '@pages/admin-page/pipe/to-id-list/to-id-list.pipe';
import { values } from 'lodash';
import { GetCityNamePipe } from '@shared/pipes/get-city-name/get-city-name.pipe';

@Component({
    selector: 'app-station-list',
    standalone: true,
    imports: [
        MatTableModule,
        MatPaginatorModule,
        GetCityNamePipe,
        MatButtonModule,
        MatIconModule,
        JoinPipe,
        ScrollToTopDirective,
        ToIdListPipe,
    ],
    templateUrl: './station-list.component.html',
    styleUrl: './station-list.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StationListComponent {
    readonly displayedColumns: string[] = ['city', 'connectedTo', 'location', 'remove'];

    readonly stationEntities = input<Dictionary<Station>>();

    readonly paginator = viewChild.required(MatPaginator);

    readonly removeOne = output<number>();

    readonly dataSource = computed(() => {
        const dataSource = new MatTableDataSource<Station | undefined>(
            values(this.stationEntities()),
        );

        dataSource.paginator = this.paginator();

        return dataSource;
    });
}
