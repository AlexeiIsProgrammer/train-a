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
import { GetConnectedCityPipe } from '@pages/admin-page/pipe/get-connected-city/get-connected-city.pipe';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-station-list',
    standalone: true,
    imports: [
        MatTableModule,
        MatPaginatorModule,
        GetConnectedCityPipe,
        MatButtonModule,
        MatIconModule,
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

    readonly stationList = computed(() => Object.values(this.stationEntities() ?? {}));
    readonly dataSource = computed(() => {
        const dataSource = new MatTableDataSource<Station | undefined>(this.stationList());

        dataSource.paginator = this.paginator();

        return dataSource;
    });
}
