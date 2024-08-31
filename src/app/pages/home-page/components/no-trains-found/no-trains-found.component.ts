import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-no-trains-found',
    standalone: true,
    imports: [NgOptimizedImage],

    templateUrl: './no-trains-found.component.html',
    styleUrl: './no-trains-found.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoTrainsFoundComponent {
    imageSrc = 'assets/no-trains-found.png';
}
