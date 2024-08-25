import {
    ChangeDetectionStrategy,
    Component,
    inject,
    Input,
    OnChanges,
    SimpleChanges,
} from '@angular/core';
import { Ride, Rides, RideSegment } from '@interface/ride.interface';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { GetConnectedCityPipe } from '@pages/admin-page/pipe/get-connected-city/get-connected-city.pipe';
import { MatIconModule } from '@angular/material/icon';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import {
    ReactiveFormsModule,
    FormArray,
    FormBuilder,
    FormControl,
    FormGroup,
} from '@angular/forms';
import { ObjectEntriesPipe } from '@shared/pipes/object-entries/object-entries.pipe';
import { Store } from '@ngrx/store';
import { selectStationsEntities } from '@store/stations/stations.selectors';
import { EditComponent } from '@shared/components/edit/edit.component';
import { first, last } from 'lodash';

type SegmentFormGroup = FormGroup<{
    time: FormArray<FormControl<string>>;
    price: FormGroup<Record<string, FormControl<number>>>;
}>;

@Component({
    selector: 'app-ride',
    standalone: true,
    imports: [
        MatButtonModule,
        CommonModule,
        GetConnectedCityPipe,
        ReactiveFormsModule,
        ObjectEntriesPipe,
        MatIconModule,
        OwlDateTimeModule,
        OwlNativeDateTimeModule,
        EditComponent,
    ],
    templateUrl: './ride.component.html',
    styleUrl: './ride.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RideComponent implements OnChanges {
    @Input({ required: true }) ride: Ride | null = null;
    @Input({ required: true }) path: Rides['path'] | null = null;

    readonly stationEntities$ = inject(Store).select(selectStationsEntities);

    constructor(private readonly formBuilder: FormBuilder) {}

    ngOnChanges({ ride }: SimpleChanges): void {
        if (ride) {
            this.createForm(this.ride!);
        }
    }

    readonly scheduleForm = this.formBuilder.nonNullable.array<SegmentFormGroup>([]);

    private createForm({ segments }: Ride): void {
        if (!this.path) {
            return;
        }

        this.path.forEach((_, i, path) => {
            const isFirst = first(path) === path[i];
            const isLast = last(path) === path[i];

            let timeValue: string[] = [];
            let priceValue: RideSegment['price'] = {};

            if (isFirst) {
                const { price, time } = segments[i];
                const [departureTime] = time;

                timeValue = [departureTime];
                priceValue = price;
            }

            if (!isFirst && !isLast) {
                const { time, price } = segments[i];

                const [, lastSegmentArrivalTime] = segments[i - 1].time;
                const [departureTime] = time;

                timeValue = [departureTime, lastSegmentArrivalTime];
                priceValue = price;
            }

            if (isLast) {
                const { time } = segments[i - 1];
                const [, lastSegmentArrivalTime] = time;

                timeValue = [lastSegmentArrivalTime];
            }

            const group = this.formBuilder.group({
                price: this.formBuilder.nonNullable.group<Record<string, number>>(priceValue),
                time: this.formBuilder.nonNullable.array<string>(timeValue),
            });

            this.scheduleForm.push(group);
        });
    }

    handleInputPriceValue(input: HTMLInputElement): void {
        const { value } = input;

        const MIN_VALUE = 1;
        const MAX_VALUE = 999999999;

        if (Number(value) < MIN_VALUE) {
            input.value = `${MIN_VALUE}`;
        }

        if (Number(value) > MAX_VALUE) {
            input.value = `${MAX_VALUE}`;
        }
    }
}
