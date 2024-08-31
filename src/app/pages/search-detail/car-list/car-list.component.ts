import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { Carriage } from '@interface/carriage.interface';
import { RideDetail } from '@interface/ride.interface';
import { Dictionary } from '@ngrx/entity';
import { CarriageComponent } from '@shared/components/carriage/carriage.component';
import { MatButtonToggleChange, MatButtonToggleModule } from '@angular/material/button-toggle';
import { CommonModule } from '@angular/common';
import { uniq } from 'lodash';

@Component({
    selector: 'app-car-list',
    standalone: true,
    imports: [CarriageComponent, MatButtonToggleModule, CommonModule],
    templateUrl: './car-list.component.html',
    styleUrl: './car-list.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarListComponent implements OnChanges {
    @Input({ required: true }) carriagesSeats: Array<[number, number]> | null = null;
    @Input({ required: true }) carriages: Dictionary<Carriage> | null = null;
    @Input({ required: true }) rideDetail: RideDetail | null = null;
    @Input({ required: true }) fromCityIdx: number | null = null;

    selectedType: string | undefined;

    ngOnChanges(): void {
        if (this.rideDetail && !this.selectedType) {
            const firstType = this.rideDetail.carriages.at(0);

            this.selectedType = firstType;
        }
    }

    selectCarType({ value }: MatButtonToggleChange): void {
        this.selectedType = value;
    }

    get occupiedSeats(): number[] {
        if (this.rideDetail && this.fromCityIdx) {
            const { schedule } = this.rideDetail;
            const occupiedSeats = schedule.segments[this.fromCityIdx].occupiedSeats;

            return occupiedSeats;
        }

        return [];
    }

    get carriageList(): Array<[number, Carriage]> {
        if (this.carriages && this.rideDetail) {
            const { carriages } = this.rideDetail;
            const carsNum: number[] = [];

            return carriages
                .filter((carName, i) => {
                    if (carName === this.selectedType) {
                        carsNum.push(i);

                        return true;
                    }

                    return false;
                })
                .reduce((acc: Array<[number, Carriage]>, name, i) => {
                    const car = this.carriages![name];

                    if (car) {
                        acc.push([carsNum[i], car]);
                    }

                    return acc;
                }, []);
        }

        return [];
    }

    get carriageTypes(): string[] {
        return uniq(this.rideDetail?.carriages);
    }
}
