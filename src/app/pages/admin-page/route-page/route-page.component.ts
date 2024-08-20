import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { selectAllRoutes } from '@store/routes/routes.selectors';
import { selectStationsEntities } from '@store/stations/stations.selectors';
import { selectCarriageTypes } from '@store/carriages/carriages.selectors';
import { RouteListComponent } from './route-list/route-list.component';

@Component({
    selector: 'app-route-page',
    standalone: true,
    imports: [RouteListComponent],
    templateUrl: './route-page.component.html',
    styleUrl: './route-page.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoutePageComponent {
    readonly routes = toSignal(this.store.select(selectAllRoutes));
    readonly stationEntities = toSignal(this.store.select(selectStationsEntities));
    readonly carriagesTypes = toSignal(this.store.select(selectCarriageTypes));

    constructor(private readonly store: Store) {}
}
