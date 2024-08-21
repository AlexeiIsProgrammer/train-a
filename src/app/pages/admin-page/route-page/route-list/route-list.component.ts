import {
    ChangeDetectionStrategy,
    Component,
    computed,
    input,
    TemplateRef,
    viewChild,
    viewChildren,
    ViewContainerRef,
} from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { Route } from '@interface/route.interface';
import { Routes } from '@type/roures.type';
import { GetConnectedCityPipe } from '@pages/admin-page/pipe/get-connected-city/get-connected-city.pipe';
import { Station } from '@interface/station.interface';
import { Dictionary } from '@ngrx/entity';
import { JoinPipe } from '@pages/admin-page/pipe/join/join.pipe';
import { ScrollToTopDirective } from '@shared/directives/scroll-to-top/scroll-to-top.directive';
import { DetailTemplateContext } from './detail-template-context.interface';
import { RouteListItem } from './route-list-item.type';
import { RouteDetailComponent } from './route-detail/route-detail.component';

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
        RouteDetailComponent,
    ],
    templateUrl: './route-list.component.html',
    styleUrl: './route-list.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({ height: '0px', minHeight: '0' })),
            state('expanded', style({ height: '55vh' })),
            transition('expanded <=> collapsed', animate('0.3s')),
        ]),
    ],
})
export class RouteListComponent {
    private readonly detailContainers = viewChildren('detailContainer', { read: ViewContainerRef });
    private readonly detailTemplate = viewChild.required('detailTemplate', {
        read: TemplateRef<DetailTemplateContext>,
    });

    readonly paginator = viewChild.required(MatPaginator);

    readonly routes = input<Routes>();
    readonly carriagesTypes = input<string[]>();
    readonly stationEntities = input<Dictionary<Station>>();

    readonly dataSource = computed(() => {
        const routes = this.routes()?.map((route, i) => ({ ...route, position: i + 1 }));
        const dataSource = new MatTableDataSource<RouteListItem>(routes);

        dataSource.paginator = this.paginator();

        return dataSource;
    });

    readonly columnsToDisplay = ['routes'];
    readonly columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];

    expandedElement: Route | null = null;

    private pageInfo: Pick<PageEvent, 'pageIndex' | 'pageSize'> = {
        pageIndex: 0,
        pageSize: 10,
    };

    updateRoute(_route: Route): void {
        //! --- update api
    }

    addDetail(route: RouteListItem) {
        const { pageIndex, pageSize } = this.pageInfo;
        const idx = route.position - 1;

        const detailContainer = this.detailContainers().at(idx - pageIndex * pageSize);

        if (detailContainer) {
            detailContainer.clear();

            detailContainer.createEmbeddedView(this.detailTemplate(), {
                routeListItem: route,
                stationEntities: this.stationEntities,
                carriagesTypes: this.carriagesTypes,
            });
        }
    }

    updatePageInfo({ pageIndex, pageSize }: PageEvent): void {
        this.pageInfo = {
            pageIndex,
            pageSize,
        };
    }
}
