import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { selectAllRoutes } from '@store/routes/routes.selectors';
import { selectStationsEntities } from '@store/stations/stations.selectors';
import { selectCarriageTypes } from '@store/carriages/carriages.selectors';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { keys, take } from 'lodash';
import { Route } from '@interface/route.interface';
import { CreateRouteComponent } from './route-list/create-route/create-route.component';
import { RouteListComponent } from './route-list/route-list.component';

@Component({
    selector: 'app-route-page',
    standalone: true,
    imports: [RouteListComponent, MatButtonModule, MatIconModule, MatDialogModule],
    templateUrl: './route-page.component.html',
    styleUrl: './route-page.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoutePageComponent {
    readonly routes = toSignal(this.store.select(selectAllRoutes));
    readonly stationEntities = toSignal(this.store.select(selectStationsEntities));
    readonly carriagesTypes = toSignal(this.store.select(selectCarriageTypes));

    constructor(
        private readonly store: Store,
        private readonly matDialog: MatDialog,
    ) {}

    openMatDialog(): void {
        const dialogRef = this.matDialog.open(CreateRouteComponent, {
            height: '90vh',
            maxWidth: '1440px',
        });
        const { componentInstance } = dialogRef;

        const randomCarriagesTypes = take(this.carriagesTypes(), 3);
        const randomStationId = take(
            keys(this.stationEntities()).map(id => Number(id)),
            3,
        );

        componentInstance.stationEntities = this.stationEntities();
        componentInstance.carriagesTypes = this.carriagesTypes();
        componentInstance.carriages = randomCarriagesTypes;
        componentInstance.pathIds = randomStationId;

        dialogRef.afterClosed().subscribe((_route: Pick<Route, 'carriages' | 'path'> | null) => {
            // todo: attach api
        });
    }
}
