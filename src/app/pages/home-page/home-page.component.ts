import { ChangeDetectionStrategy, Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SearchComponent } from '@core/components/search/search.component';
import { Store } from '@ngrx/store';
import { StationsActions } from '@store/stations/stations.actions';
import { selectAllStations } from '@store/stations/stations.selectors';

@Component({
    selector: 'app-home-page',
    standalone: true,
    imports: [SearchComponent],
    templateUrl: './home-page.component.html',
    styleUrl: './home-page.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {
    readonly stations = toSignal(this.store.select(selectAllStations));

    constructor(private readonly store: Store) {
        this.store.dispatch(StationsActions.loadAll());
    }
}
