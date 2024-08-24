import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Ride, Rides } from '@interface/ride.interface';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { GetConnectedCityPipe } from '@pages/admin-page/pipe/get-connected-city/get-connected-city.pipe';

import {
    ReactiveFormsModule,
    FormArray,
    FormBuilder,
    FormControl,
    FormGroup,
} from '@angular/forms';
import { ObjectEntriesPipe } from '@shared/pipes/object-entries/object-entries.pipe';

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
    ],
    templateUrl: './ride.component.html',
    styleUrl: './ride.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RideComponent implements OnChanges {
    @Input({ required: true }) ride: Ride | null = null;
    @Input({ required: true }) path: Rides['path'] | null = null;

    constructor(private readonly formBuilder: FormBuilder) {
        // this.scheduleForm.valueChanges.subscribe(console.log);
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
