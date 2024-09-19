import { ChangeDetectionStrategy, Component } from '@angular/core';
import { selectAllStations, selectStationsEntities } from '@store/stations/stations.selectors';
import { Store } from '@ngrx/store';
import { MatCardModule } from '@angular/material/card';
import { StationRequest } from '@type/station.type';
import { StationsActions } from '@store/stations/stations.actions';
import { AsyncPipe } from '@angular/common';
import { MapComponent } from './map/map.component';
import { StationListComponent } from './station-list/station-list.component';
import { StationConnectorComponent } from './station-connector/station-connector.component';
import { ConnectStationService } from './services/connect-station/connect-station.service';

@Component({
    selector: 'app-stations-page',
    standalone: true,
    imports: [
        MapComponent,
        StationListComponent,
        StationConnectorComponent,
        MatCardModule,
        AsyncPipe,
    ],
    templateUrl: './stations-page.component.html',
    styleUrl: './stations-page.component.scss',
    providers: [ConnectStationService],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StationsPageComponent {
    readonly stations$ = this.store.select(selectAllStations);
    readonly stationEntities$ = this.store.select(selectStationsEntities);

    constructor(private readonly store: Store) {}

    createOne(station: StationRequest) {
        this.store.dispatch(StationsActions.createOne(station));
    }

    removeOne(id: number): void {
        this.store.dispatch(StationsActions.removeOne(id));
    }
}
