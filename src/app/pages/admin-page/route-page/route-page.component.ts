import { Component, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { selectAllRoutes } from '@store/routes/routes.selectors';
import { selectStationsEntities } from '@store/stations/stations.selectors';
import { selectCarriageTypes } from '@store/carriages/carriages.selectors';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { keys, take } from 'lodash';
import { Route } from '@interface/route.interface';
import { filter, withLatestFrom } from 'rxjs';
import { RoutesActions } from '@store/routes/routes.actions';
import { ConfirmDeleteComponent } from '@shared/components/confirm-delete/confirm-delete.component';
import { AsyncPipe } from '@angular/common';
import { RouteListComponent } from './route-list/route-list.component';
import { CreateRouteComponent } from './route-list/create-route/create-route.component';

@Component({
    selector: 'app-route-page',
    standalone: true,
    imports: [RouteListComponent, MatButtonModule, MatIconModule, MatDialogModule, AsyncPipe],
    templateUrl: './route-page.component.html',
    styleUrl: './route-page.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoutePageComponent {
    readonly routes$ = this.store.select(selectAllRoutes);
    readonly stationEntities$ = this.store.select(selectStationsEntities);
    readonly carriagesTypes$ = this.store.select(selectCarriageTypes);

    constructor(
        private readonly store: Store,
        private readonly matDialog: MatDialog,
        private readonly destroyRef: DestroyRef,
    ) {}

    updateRoute(route: Route): void {
        this.store.dispatch(RoutesActions.updateCurrent(route));
    }

    createRoute(route: Omit<Route, 'id'>): void {
        this.store.dispatch(RoutesActions.createCurrent(route));
    }

    removeRoute(id: Route['id']): void {
        const dialogRef = this.matDialog.open(ConfirmDeleteComponent);

        dialogRef
            .afterClosed()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(boolean => {
                if (boolean) {
                    this.store.dispatch(RoutesActions.removeCurrent(id));
                }
            });
    }

    openMatDialog(): void {
        const dialogRef = this.matDialog.open(CreateRouteComponent, {
            height: '90vh',
            maxWidth: '1440px',
        });
        const { componentRef } = dialogRef;

        dialogRef
            .afterOpened()
            .pipe(withLatestFrom(this.carriagesTypes$, this.stationEntities$))
            .subscribe(([, carriagesTypes, stationEntities]) => {
                const randomCarriagesTypes = take(carriagesTypes, 1);
                const randomStationId = take(
                    keys(stationEntities).map(id => Number(id)),
                    1,
                );

                componentRef?.setInput('stationEntities', stationEntities);
                componentRef?.setInput('carriages', randomCarriagesTypes);
                componentRef?.setInput('carriagesTypes', carriagesTypes);
                componentRef?.setInput('pathIds', randomStationId);
            });

        dialogRef
            .afterClosed()
            .pipe(takeUntilDestroyed(this.destroyRef), filter(Boolean))
            .subscribe((route: Pick<Route, 'carriages' | 'path'>) => {
                this.createRoute(route);
            });
    }
}
