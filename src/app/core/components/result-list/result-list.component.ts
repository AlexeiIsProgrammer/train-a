import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NoTrainsFoundComponent } from './no-trains-found/no-trains-found.component';

@Component({
    selector: 'app-result-list',
    standalone: true,
    imports: [NoTrainsFoundComponent],
    templateUrl: './result-list.component.html',
    styleUrl: './result-list.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResultListComponent {}
