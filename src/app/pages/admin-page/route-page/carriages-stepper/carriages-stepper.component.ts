import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { ChangeDetectionStrategy, Component, effect, Injector, input } from '@angular/core';
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
export class CarriagesStepperComponent {
    readonly carriagesTypes = input<string[]>();
    readonly carriages = input<string[]>();

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly injector: Injector,
    ) {
        this.watchCarriagesTypes();
    }

    readonly carriagesForm = this.formBuilder.nonNullable.array<string>([]);

    selectCity(carriagesFormIndex: number, type: string): void {
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

    private watchCarriagesTypes(): void {
        effect(
            () => {
                this.carriages()?.forEach(type => {
                    const newControl = this.formBuilder.nonNullable.control(type);

                    this.carriagesForm.push(newControl);
                });
            },
            { injector: this.injector },
        );
    }
}
