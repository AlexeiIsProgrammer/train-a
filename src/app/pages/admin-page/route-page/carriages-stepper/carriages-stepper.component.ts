import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { ChangeDetectionStrategy, Component, input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';

@Component({
    selector: 'app-carriages-stepper',
    standalone: true,
    imports: [MatStepperModule, MatButtonModule, MatIconModule, MatIconModule, MatSelectModule],
    templateUrl: './carriages-stepper.component.html',
    styleUrl: './carriages-stepper.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: STEPPER_GLOBAL_OPTIONS,
            useValue: { displayDefaultIndicatorType: false },
        },
    ],
})
export class CarriagesStepperComponent implements OnChanges {
    readonly carriagesTypes = input<string[] | null>();
    readonly carriages = input<string[]>();

    constructor(private readonly formBuilder: FormBuilder) {}

    ngOnChanges({ carriages }: SimpleChanges): void {
        if (carriages) {
            this.carriages()?.forEach(type => {
                const newControl = this.formBuilder.nonNullable.control(type);

                this.carriagesForm.push(newControl);
            });
        }
    }

    readonly carriagesForm = this.formBuilder.nonNullable.array<string>([]);

    editOne(carriagesFormIndex: number, type: string): void {
        const { controls } = this.carriagesForm;

        controls[carriagesFormIndex].setValue(type);
    }

    removeOne(index: number): void {
        this.carriagesForm.removeAt(index);
    }

    addOne(index: number, type: string): void {
        this.carriagesForm.insert(index + 1, this.formBuilder.nonNullable.control(type));
    }

    get carriageControls(): Array<FormControl<string>> {
        return this.carriagesForm.controls;
    }

    get carriageTypes(): string[] {
        return this.carriagesForm.getRawValue();
    }

    get canRemove(): boolean {
        return this.carriagesForm.controls.length > 3;
    }

    get canSave(): boolean {
        return this.carriagesForm.controls.length >= 3;
    }
}
