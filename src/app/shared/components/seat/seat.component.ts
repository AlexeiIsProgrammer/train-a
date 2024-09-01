import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';
import { SeatBackgroundDirective } from './directives/seat-background.directive';

@Component({
    selector: 'app-seat',
    standalone: true,
    imports: [SeatBackgroundDirective, NgClass],
    templateUrl: './seat.component.html',
    styleUrls: ['./seat.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeatComponent {
    @Input() isFree = true;
    @Input() seatNumber = 1;
    @Input() isSmallModel: boolean | null = null;
    @Input() isSelected = false;
    // @Output() seatClicked = new EventEmitter<number>();

    // onSeatClick(): void {
    //     this.seatClicked.emit(this.seatNumber - 1);
    // }
}
