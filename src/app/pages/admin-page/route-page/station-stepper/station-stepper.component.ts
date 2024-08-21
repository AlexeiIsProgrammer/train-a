import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    DestroyRef,
    effect,
    Injector,
    input,
    signal,
    TemplateRef,
    viewChild,
    viewChildren,
    ViewContainerRef,
} from '@angular/core';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { Station } from '@interface/station.interface';
import { Dictionary } from '@ngrx/entity';
import { GetConnectedCityPipe } from '@pages/admin-page/pipe/get-connected-city/get-connected-city.pipe';
import { MatSelectModule } from '@angular/material/select';
import { omit, uniq, values } from 'lodash';
import { ScrollToTopDirective } from '@shared/directives/scroll-to-top/scroll-to-top.directive';
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
        ScrollToTopDirective,
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
        viewChild.required<TemplateRef<{ $implicit: number }>>('selectOptions');

    private readonly selectedStation = signal<number[]>([]);

    readonly stationEntities = input<Dictionary<Station>>();
    readonly pathIds = input<number[]>();
    readonly position = input<number>();

    readonly stationList = computed(() => {
        const availableStations = omit(
            this.stationEntities(),
            uniq([...this.selectedStation(), ...this.stationsForm.getRawValue()]),
        );

        return values(availableStations);
    });

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly injector: Injector,
        private readonly destroyRef: DestroyRef,
    ) {
        this.watchRoute();
        this.watchStationsFormValueChanges();
    }

    readonly stationsForm = this.formBuilder.nonNullable.array<number>([]);

    removeOne(index: number): void {
        this.stationsForm.removeAt(index);

        const { length } = this.stepContainer();
        const isLastIndex = length === index + 1;

        if (isLastIndex) {
            this.addSelector(index);

            return;
        }

        this.addSelector(index + 2);
    }

    editOne(index: number, stationID: number): void {
        this.stationsForm.controls.at(index)?.setValue(stationID);
    }

    addOne(index: number, stationID: number): void {
        const newControl = this.formBuilder.nonNullable.control(stationID);

        this.stationsForm.insert(index + 1, newControl);
    }

    addSelector(selectedIndex: number): void {
        const idx = selectedIndex - 1;
        const stepContainer = this.stepContainer().at(idx);

        if (selectedIndex && stepContainer) {
            stepContainer.clear();
            stepContainer.createEmbeddedView(this.selectOptionsTemplate(), { $implicit: idx });
        }
    }

    private watchRoute(): void {
        effect(
            () => {
                this.pathIds()?.forEach(id => {
                    const newStationControl = this.formBuilder.nonNullable.control(id);

                    this.stationsForm.push(newStationControl);
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

    get path(): number[] {
        return this.stationsForm.getRawValue();
    }

    get pathControls(): Array<FormControl<number>> {
        return this.stationsForm.controls;
    }

    get canRemove(): boolean {
        return this.stationsForm.controls.length > 3;
    }
}
