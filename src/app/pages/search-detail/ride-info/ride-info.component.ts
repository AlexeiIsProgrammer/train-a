import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PageParams } from '../page-params.type';

@Component({
    selector: 'app-ride-info',
    standalone: true,
    imports: [MatButtonModule, MatIconModule, DatePipe],
    templateUrl: './ride-info.component.html',
    styleUrl: './ride-info.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RideInfoComponent {
    @Input() dateOfDeparture: string | null = null;
    @Input() pageParams: PageParams | null = null;
    @Input() fromCity: string | undefined;
    @Input() toCity: string | undefined;
}
