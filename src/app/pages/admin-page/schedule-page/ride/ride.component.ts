import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Ride } from '@interface/ride.interface';

@Component({
    selector: 'app-ride',
    standalone: true,
    imports: [],
    templateUrl: './ride.component.html',
    styleUrl: './ride.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RideComponent {
    @Input({ required: true }) ride: Ride | null = null;
}
