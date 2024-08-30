import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ResultListComponent } from '@pages/home-page/result-list/result-list.component';
import { SearchComponent } from '@core/components/search/search.component';
import { Store } from '@ngrx/store';
import { StationsActions } from '@store/stations/stations.actions';
import { selectAllStations } from '@store/stations/stations.selectors';
import { selectSearchStations } from '@store/search/search.selectors';
import { MatListModule } from '@angular/material/list';
import { ResultListItemComponent } from '@core/components/result-list-item/result-list-item.component';
import { CommonModule } from '@angular/common';
import { GetCurrentCities } from '@type/search.type';
import { NoTrainsFoundComponent } from './result-list/no-trains-found/no-trains-found.component';

@Component({
    selector: 'app-home-page',
    standalone: true,
    imports: [
        SearchComponent,
        ResultListComponent,
        MatListModule,
        NoTrainsFoundComponent,
        ResultListItemComponent,
        CommonModule,
    ],
    templateUrl: './home-page.component.html',
    styleUrl: './home-page.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent implements OnInit {
    readonly stations = toSignal(this.store.select(selectAllStations));
    readonly searchStations = toSignal(this.store.select(selectSearchStations));

    getCurrentCitiesBind!: (routes: GetCurrentCities) => [string, string];

    constructor(private readonly store: Store) {
        this.store.dispatch(StationsActions.loadAll());
    }

    ngOnInit(): void {
        this.getCurrentCitiesBind = this.getCurrentCities.bind(this);
    }

    getCurrentCities({ route1, route2 }: GetCurrentCities): [string, string] {
        if (!this.stations()) {
            return ['City is not loaded', 'City is not loaded'];
        }

        return [
            this.stations()?.find(station => station.id === route1)?.city || "City isn't exists",
            this.stations()?.find(station => station.id === route2)?.city || "City isn't exists",
        ];
    }
}
