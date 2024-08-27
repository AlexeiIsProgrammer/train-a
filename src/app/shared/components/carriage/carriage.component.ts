import {
    ChangeDetectionStrategy,
    Component,
    Input,
    OnInit,
    OnChanges,
    SimpleChanges,
} from '@angular/core';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { Carriage } from '@interface/carriage.interface';
import { Seat } from '@interface/seat.interface';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CarriageFormService } from '@pages/admin-page/carriages-page/carriages-form/services/carriage-form.service';
import { SeatComponent } from '../seat/seat.component';
import { CarriageService } from './services/carriage.service';

@Component({
    selector: 'app-carriage',
    standalone: true,
    templateUrl: './carriage.component.html',
    styleUrls: ['./carriage.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [SeatComponent, NgFor, NgIf, MatButtonModule, MatIconModule, NgClass],
})
export class CarriageComponent implements OnInit, OnChanges {
    @Input() carriage!: Carriage;
    @Input() isSmallModel: boolean | null = null;
    rotatedSeatingMatrices: Seat[][] = [];

    constructor(
        private readonly carriageService: CarriageService,
        private readonly carriageFormService: CarriageFormService,
    ) {}

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
        const seatingData = this.carriageService.generateSeatingData(this.carriage);

        if (window.innerWidth > 768) {
            this.rotatedSeatingMatrices = this.carriageService.rotateSeatingMatrix(seatingData);
        } else {
            this.rotatedSeatingMatrices = seatingData;
        }
    }

    countFreeSeats(): number {
        return this.carriageService.countFreeSeats(this.rotatedSeatingMatrices);
    }

    onSeatClick(code: string, columnIndex: number, seatNumber: number) {
        console.info(`Seat clicked: Code: ${code}, Column: ${columnIndex}, Row: ${seatNumber}`);
    }

    openEditForm() {
        this.carriageFormService.setEditForm(true);
        this.carriageFormService.setCreateForm(false);

        this.carriageFormService.updateCarriageData(this.carriage);
        this.scrollToForm();
    }

    scrollToForm() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }
}
