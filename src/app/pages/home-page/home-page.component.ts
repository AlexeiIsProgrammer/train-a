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
import { NoTrainsFoundComponent } from './no-trains-found/no-trains-found.component';

@Component({
    selector: 'app-home-page',
    standalone: true,
    imports: [
        SearchComponent,
        MatListModule,
        NoTrainsFoundComponent,
        ResultListItemComponent,
        CommonModule,
    ],
    templateUrl: './home-page.component.html',
    styleUrl: './home-page.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {
    readonly stations = toSignal(this.store.select(selectAllStations));
    readonly searchStations = toSignal(this.store.select(selectSearchStations));

    constructor(private readonly store: Store) {
        this.store.dispatch(StationsActions.loadAll());
    }
}
