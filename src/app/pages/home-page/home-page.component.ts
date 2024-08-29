import { ChangeDetectionStrategy, Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ResultListComponent } from '@pages/home-page/result-list/result-list.component';
import { SearchComponent } from '@core/components/search/search.component';
import { Store } from '@ngrx/store';
import { StationsActions } from '@store/stations/stations.actions';
import { selectAllStations } from '@store/stations/stations.selectors';
import { selectSearchStations } from '@store/search/search.selectors';

@Component({
    selector: 'app-home-page',
    standalone: true,
    imports: [SearchComponent, ResultListComponent],
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
