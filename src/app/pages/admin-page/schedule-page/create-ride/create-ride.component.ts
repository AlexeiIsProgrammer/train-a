import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectStationsEntities } from '@store/stations/stations.selectors';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatSelectModule } from '@angular/material/select';
import { RideSegment } from '@interface/ride.interface';
import { first, last } from 'lodash';
import { MatIconModule } from '@angular/material/icon';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { ObjectEntriesPipe } from '@shared/pipes/object-entries/object-entries.pipe';
import { GetCityNamePipe } from '@shared/pipes/get-city-name/get-city-name.pipe';
import { SegmentFormGroup } from '../segment-form-group.type';
import { parseToRequest } from '../utils/parse-to-request';

@Component({
    selector: 'app-create-ride',
    standalone: true,
    imports: [
        MatButtonModule,
        MatStepperModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        GetCityNamePipe,
        CommonModule,
        MatSelectModule,
        MatIconModule,
        OwlDateTimeModule,
        OwlNativeDateTimeModule,
        ObjectEntriesPipe,
    ],
    templateUrl: './create-ride.component.html',
    styleUrl: './create-ride.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: STEPPER_GLOBAL_OPTIONS,
            useValue: { displayDefaultIndicatorType: false },
        },
    ],
})
export class CreateRideComponent implements OnChanges {
    @Input({ required: true }) path: number[] | null = null;
    @Input({ required: true }) carriages: string[] | null = null;

    readonly stationEntities$ = this.store.select(selectStationsEntities);
    readonly scheduleForm = this.formBuilder.nonNullable.array<SegmentFormGroup>([]);

    constructor(
        private readonly store: Store,
        private readonly formBuilder: FormBuilder,
    ) {}

    ngOnChanges({ path, carriages }: SimpleChanges): void {
        if (path || carriages) {
            this.createForm();
        }
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

    get minDate(): string {
        return new Date().toISOString();
    }

    get canSave(): boolean {
        return this.scheduleForm.status === 'VALID';
    }

    get newRide(): RideSegment[] {
        return parseToRequest(this.scheduleForm.getRawValue());
    }

    private createForm(): void {
        if (!this.carriages || !this.path) {
            return;
        }

        this.scheduleForm.clear();

        this.path.forEach((_, i) => {
            const isFirst = first(this.path) === this.path![i];
            const isLast = last(this.path) === this.path![i];

            let timeValue: string[] = [''];
            let priceValue: RideSegment['price'] = this.carriages!.reduce(
                (acc: RideSegment['price'], type) => {
                    acc[type] = NaN;

                    return acc;
                },
                {},
            );

            if (isFirst) {
                timeValue = [''];
            }

            if (!isFirst && !isLast) {
                timeValue = ['', ''];
            }

            if (isLast) {
                timeValue = [''];
                priceValue = {};
            }

            const group = this.formBuilder.nonNullable.group({
                price: this.formBuilder.nonNullable.group<Record<string, number>>(priceValue),
                time: this.formBuilder.nonNullable.array<string>(timeValue),
            });

            this.scheduleForm.push(group);
        });
    }
}
