import { ChangeDetectionStrategy, Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SearchComponent } from '@core/components/search/search.component';
import { Store } from '@ngrx/store';
import { StationsActions } from '@store/stations/stations.actions';
import { selectAllStations } from '@store/stations/stations.selectors';
import { selectSearchStations } from '@store/search/search.selectors';
import { MatListModule } from '@angular/material/list';
import { ResultListItemComponent } from '@core/components/result-list-item/result-list-item.component';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { ToDatePipe } from '@shared/pipes/to-date/to-date.pipe';
import { selectAllCarriages } from '@store/carriages/carriages.selectors';
import { CarriageActions } from '@store/carriages/carriages.actions';
import { NoTrainsFoundComponent } from './components/no-trains-found/no-trains-found.component';
import { DateFilterPipe } from './pipe/date-filter/date-filter.pipe';
import { ToDateTabsPipe } from './pipe/to-date-tabs/to-date-tabs.pipe';
import { GetDayPipe } from './pipe/get-day/get-day.pipe';

@Component({
    selector: 'app-home-page',
    standalone: true,
    imports: [
        SearchComponent,
        MatListModule,
        NoTrainsFoundComponent,
        ResultListItemComponent,
        CommonModule,
        MatTabsModule,
        ToDatePipe,
        DateFilterPipe,
        ToDateTabsPipe,
        GetDayPipe,
    ],
    templateUrl: './home-page.component.html',
    styleUrl: './home-page.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {
    readonly stations = toSignal(this.store.select(selectAllStations));
    readonly searchStations = toSignal(this.store.select(selectSearchStations));
    readonly carriages = toSignal(this.store.select(selectAllCarriages));

    constructor(private readonly store: Store) {
        this.store.dispatch(StationsActions.loadAll());
        this.store.dispatch(CarriageActions.loadAll());
    }
}
