import {
    ChangeDetectionStrategy,
    Component,
    Input,
    OnInit,
    OnChanges,
    SimpleChanges,
    EventEmitter,
    Output,
} from '@angular/core';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { Carriage } from '@interface/carriage.interface';
import { Seat } from '@interface/seat.interface';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SeatComponent } from '../seat/seat.component';
import { CarriageService } from './services/carriage.service';
import { IsSeatFreePipe } from './pipe/is-seat-free/is-seat-free.pipe';

@Component({
    selector: 'app-carriage',
    standalone: true,
    templateUrl: './carriage.component.html',
    styleUrls: ['./carriage.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [SeatComponent, NgFor, NgIf, MatButtonModule, MatIconModule, NgClass, IsSeatFreePipe],
    providers: [CarriageService],
})
export class CarriageComponent implements OnInit, OnChanges {
    @Input({ required: true }) carriage: Carriage | null = null;
    @Input() isSmallModel: boolean | null = null;
    @Input() selectedSeat: number | null = null;
    @Input() occupiedSeats: number[] = [];
    @Input() carNum: number | null = null;
    @Input() firstSeatNum = 1;

    @Output() seatClicked = new EventEmitter<number>();

    rotatedSeatingMatrices: Seat[][] = [];

    constructor(private readonly carriageService: CarriageService) {}

    ngOnInit() {
        this.updateSeatingMatrix();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['carriage']) {
            // console.info('carriage changed:', changes['carriage'].currentValue);
            this.updateSeatingMatrix();
        }
    }

    private updateSeatingMatrix() {
        if (!this.carriage) {
            return;
        }

        const seatingData = this.carriageService.generateSeatingData(this.carriage);

        if (window.innerWidth > 768) {
            this.rotatedSeatingMatrices = this.carriageService.rotateSeatingMatrix(seatingData);
        } else {
            this.rotatedSeatingMatrices = seatingData;
        }
    }

    countFreeSeats(): number {
        const countFreeSeats = this.rotatedSeatingMatrices
            .flat()
            // eslint-disable-next-line @typescript-eslint/naming-convention
            .filter(({ seat_number, isFree }) => {
                if (isFree === 1 && !this.occupiedSeats.includes(seat_number + this.firstSeatNum)) {
                    return true;
                }

                return false;
            }).length;

        return countFreeSeats;
    }

    // onSeatClick(seatNumber: number) {
    //     console.info(`Seat clicked:${seatNumber}`);
    // }
}
