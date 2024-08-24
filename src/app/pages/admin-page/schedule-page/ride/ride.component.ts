import {
    ChangeDetectionStrategy,
    Component,
    inject,
    Input,
    OnChanges,
    SimpleChanges,
} from '@angular/core';
import { Ride, Rides } from '@interface/ride.interface';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { GetConnectedCityPipe } from '@pages/admin-page/pipe/get-connected-city/get-connected-city.pipe';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import {
    ReactiveFormsModule,
    FormArray,
    FormBuilder,
    FormControl,
    FormGroup,
    AbstractControl,
} from '@angular/forms';
import { ObjectEntriesPipe } from '@shared/pipes/object-entries/object-entries.pipe';
import { Store } from '@ngrx/store';
import { selectStationsEntities } from '@store/stations/stations.selectors';

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
        MatInputModule,
        MatFormFieldModule,
        OwlDateTimeModule,
        OwlNativeDateTimeModule,
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

    setDate(_dateTime: string, _control: AbstractControl | null) {
        // console.log(2)
        // control?.setValue(new Date(dateTime).toISOString());
    }

    ngOnChanges({ ride }: SimpleChanges): void {
        if (ride) {
            this.createForm(this.ride!);
        }
    }

    readonly scheduleForm = this.formBuilder.nonNullable.array<SegmentFormGroup>([]);

    private createForm({ segments }: Ride): void {
        segments.forEach(({ time, price }) => {
            const group = this.formBuilder.nonNullable.group({
                price: this.formBuilder.nonNullable.group<Record<string, number>>(price),
                time: this.formBuilder.nonNullable.array<string>(time),
            });

            this.scheduleForm.push(group);
        });
    }
}
