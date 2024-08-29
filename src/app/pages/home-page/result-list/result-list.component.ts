import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { SearchStations } from '@interface/search.interface';
import { ResultListItemComponent } from '@core/components/result-list-item/result-list-item.component';
import { CommonModule } from '@angular/common';
import { NoTrainsFoundComponent } from './no-trains-found/no-trains-found.component';

@Component({
    selector: 'app-result-list',
    standalone: true,
    imports: [NoTrainsFoundComponent, MatListModule, ResultListItemComponent, CommonModule],
    templateUrl: './result-list.component.html',
    styleUrl: './result-list.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResultListComponent {
    readonly searchStations = input<SearchStations>();
}
