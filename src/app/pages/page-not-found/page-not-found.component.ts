import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
    selector: 'app-page-not-found',
    standalone: true,
    imports: [MatIcon],
    templateUrl: './page-not-found.component.html',
    styleUrl: './page-not-found.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageNotFoundComponent {}
