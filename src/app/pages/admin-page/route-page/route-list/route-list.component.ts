import { ChangeDetectionStrategy, Component, computed, input, viewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { Route } from '@interface/route.inrerface';
import { Routes } from '@type/roures.type';
import { GetConnectedCityPipe } from '@pages/admin-page/pipe/get-connected-city/get-connected-city.pipe';
import { Station } from '@interface/station.interface';
import { Dictionary } from '@ngrx/entity';
import { JoinPipe } from '@pages/admin-page/pipe/join/join.pipe';
import { ScrollToTopDirective } from '@shared/directives/scroll-to-top/scroll-to-top.directive';
import { StationStepperComponent } from '../station-stepper/station-stepper.component';

@Component({
    selector: 'app-route-list',
    standalone: true,
    imports: [
        MatTableModule,
        MatButtonModule,
        MatIconModule,
        MatPaginatorModule,
        CommonModule,
        GetConnectedCityPipe,
        JoinPipe,
        ScrollToTopDirective,
        StationStepperComponent,
    ],
    templateUrl: './route-list.component.html',
    styleUrl: './route-list.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger('detailExpand', [
            state('collapsed,void', style({ height: '0px', minHeight: '0' })),
            state('expanded', style({ height: '*' })),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
})
export class RouteListComponent {
    readonly paginator = viewChild.required(MatPaginator);

    readonly routes = input<Routes>();
    readonly carriagesNames = input<string[]>();
    readonly stationEntities = input<Dictionary<Station>>();

    readonly dataSource = computed(() => {
        const routes = this.routes()?.map((route, i) => ({ ...route, position: i + 1 }));
        const dataSource = new MatTableDataSource<Route & { position: number }>(routes);

        dataSource.paginator = this.paginator();

        return dataSource;
    });

    readonly columnsToDisplay = ['routes'];
    readonly columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];

    expandedElement: Route | null = null;
}
