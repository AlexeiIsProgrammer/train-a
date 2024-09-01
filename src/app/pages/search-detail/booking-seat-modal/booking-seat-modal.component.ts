import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { RideDetail } from '@interface/ride.interface';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SelectedSeat } from '../selected-seat.interface';

@Component({
    selector: 'app-booking-seat-modal',
    standalone: true,
    imports: [MatButtonModule, MatIconModule],
    templateUrl: './booking-seat-modal.component.html',
    styleUrl: './booking-seat-modal.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookingSeatModalComponent {
    @Input({ required: true }) total: number | null = null;
    @Input({ required: true }) rideDetail: RideDetail | null = null;
    @Input({ required: true }) selectedSeat: SelectedSeat | null = null;

    @Output() bookSeat = new EventEmitter<void>();
    @Output() closeModal = new EventEmitter<void>();
}
