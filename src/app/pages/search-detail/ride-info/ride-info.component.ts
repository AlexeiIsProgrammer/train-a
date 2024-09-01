import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { PageParams } from '../page-params.type';

@Component({
    selector: 'app-ride-info',
    standalone: true,
    imports: [MatButtonModule, MatIconModule, DatePipe, RouterLink],
    templateUrl: './ride-info.component.html',
    styleUrl: './ride-info.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RideInfoComponent {
    @Input() dateOfDeparture: string | null = null;
    @Input() pageParams: PageParams | null = null;
    @Input() fromCity: string | null = null;
    @Input() toCity: string | null = null;

    @Output() openSchedule = new EventEmitter<void>();
}
