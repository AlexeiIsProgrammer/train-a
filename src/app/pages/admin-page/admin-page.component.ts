import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { StationsActions } from '@store/stations/stations.actions';
import { CommonModule } from '@angular/common';
import { RoutesActions } from '@store/routes/routes.actions';
import { CarriageActions } from '@store/carriages/carriages.actions';
import { RouterModule } from '@angular/router';
import { StationsPageComponent } from './stations-page/stations-page.component';
import { RoutePageComponent } from './route-page/route-page.component';

@Component({
    selector: 'app-admin-page',
    standalone: true,
    imports: [CommonModule, StationsPageComponent, RoutePageComponent, RouterModule],
    templateUrl: './admin-page.component.html',
    styleUrl: './admin-page.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminPageComponent {
    constructor(private readonly store: Store) {
        this.store.dispatch(StationsActions.loadAll());
        this.store.dispatch(RoutesActions.loadAll());
        this.store.dispatch(CarriageActions.loadAll());
    }
}
