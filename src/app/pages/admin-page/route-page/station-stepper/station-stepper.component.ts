import { STEPPER_GLOBAL_OPTIONS, StepperSelectionEvent } from '@angular/cdk/stepper';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    computed,
    DestroyRef,
    effect,
    Injector,
    input,
    output,
    signal,
    TemplateRef,
    viewChild,
    viewChildren,
    ViewContainerRef,
} from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { Route } from '@interface/route.inrerface';
import { Station } from '@interface/station.interface';
import { Dictionary } from '@ngrx/entity';
import { GetConnectedCityPipe } from '@pages/admin-page/pipe/get-connected-city/get-connected-city.pipe';
import { MatSelectModule } from '@angular/material/select';
import { omit, values } from 'lodash';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-station-stepper',
    standalone: true,
    imports: [
        MatStepperModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        GetConnectedCityPipe,
        MatButtonModule,
        MatIconModule,
        MatSelectModule,
    ],
    templateUrl: './station-stepper.component.html',
    styleUrl: './station-stepper.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: STEPPER_GLOBAL_OPTIONS,
            useValue: { displayDefaultIndicatorType: false },
        },
    ],
})
export class StationStepperComponent {
    private readonly stepContainer = viewChildren('stepContainer', { read: ViewContainerRef });
    private readonly selectOptionsTemplate =
        viewChild<TemplateRef<{ $implicit: number }>>('selectOptions');

    private readonly selectedStation = signal<number[]>([]);

    readonly stationEntities = input<Dictionary<Station>>();
    readonly route = input.required<Route & { position: number }>();

    readonly update = output<Route>();

    readonly stationList = computed(() => {
        const availableStations = omit(this.stationEntities(), this.selectedStation());

        return values(availableStations);
    });

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly changeDetectorRef: ChangeDetectorRef,
        private readonly injector: Injector,
        private readonly destroyRef: DestroyRef,
    ) {
        this.watchRoute();
        this.watchStationsFormValueChanges();
    }

    readonly stationsForm = this.formBuilder.nonNullable.array<number>([]);

    addSelector({ selectedIndex }: StepperSelectionEvent): void {
        const stepContainers = this.stepContainer();
        const idx = selectedIndex - 1;

        if (idx >= 0 && idx < stepContainers.length) {
            const stepContainer = stepContainers[idx];

            stepContainer.clear();
            stepContainer.createEmbeddedView(this.selectOptionsTemplate()!, { $implicit: idx });

            this.changeDetectorRef.markForCheck();
        }
    }

    selectCity(stationsFormIndex: number, stationId: number): void {
        const { controls } = this.stationsForm;

        controls[stationsFormIndex].setValue(stationId);
    }

    updateRoute(stationID?: number): void {
        const route = this.route();
        const path = this.selectedStation();

        if (stationID) {
            path.push(stationID);
        }

        const updatedRoute = { ...route, path };

        this.update.emit(omit(updatedRoute, 'position'));
    }

    private watchRoute(): void {
        effect(
            () => {
                this.route()?.path.forEach(id => {
                    this.stationsForm.push(this.formBuilder.nonNullable.control(id));
                });
            },
            { injector: this.injector },
        );
    }

    private watchStationsFormValueChanges(): void {
        this.stationsForm.valueChanges
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(stations => {
                this.selectedStation.set(stations);
            });
    }

    get pathControls() {
        return this.stationsForm.controls;
    }
}
