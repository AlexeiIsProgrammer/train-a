import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { NgClass } from '@angular/common';
import { SeatBackgroundDirective } from './directives/seat-background.directive';

@Component({
    selector: 'app-seat',
    standalone: true,
    imports: [NgClass, SeatBackgroundDirective],
    templateUrl: './seat.component.html',
    styleUrls: ['./seat.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeatComponent {
    @Input() value: string | number = 1;
    @Input() seatNumber = 1;
    @Input() isSmallModel: boolean | null = null;
    @Output() seatClicked = new EventEmitter<number>();

    onSeatClick(): void {
        this.seatClicked.emit(this.seatNumber - 1);
    }
}
