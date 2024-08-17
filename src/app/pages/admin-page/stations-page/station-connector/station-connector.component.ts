import { ChangeDetectionStrategy, Component, effect, Injector, input, output } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { required } from '@shared/form-validators/required.validator';
import { isLatitude } from '@shared/form-validators/is-latitude.validator';
import { isLongitude } from '@shared/form-validators/is-longitude.validator';
import { Station } from '@interface/station.interface';
import { hasGaps } from '@shared/form-validators/has-gaps.validator';
import { omit, pick } from 'lodash';
import { LeafletMouseEvent } from 'leaflet';
import { GetControlErrorMessagePipe } from '@shared/pipes/get-control-error-message/get-control-error-message.pipe';
import { StationList, StationRequest } from '@type/station.type';
import { ConnectStationService } from '../services/connect-station/connect-station.service';

@Component({
    selector: 'app-station-connector',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatButtonToggleModule,
        GetControlErrorMessagePipe,
    ],
    templateUrl: './station-connector.component.html',
    styleUrl: './station-connector.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StationConnectorComponent {
    readonly stationList = input<StationList>();
    readonly updateOne = output<StationRequest>();

    readonly isEditMode = this.connectStationService.isEditMode;
    readonly selectedStation = this.connectStationService.selectedStation;

    readonly connectionForm = this.formBuilder.nonNullable.group({
        city: ['', [required(), hasGaps]],
        latitude: [0, [required(), isLatitude]],
        longitude: [0, [required(), isLongitude]],
    });

    readonly connectedStationControl = this.formBuilder.nonNullable.control<number[]>([], {
        validators: ({ value }) => (value.length ? null : { tag: 'At least one city' }),
    });

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly connectStationService: ConnectStationService,
        private readonly injector: Injector,
    ) {
        this.watchForModeUpdate();
    }

    toggleMode(): void {
        this.connectionForm.reset();
        this.connectedStationControl.reset();

        this.connectStationService.toggleMode();
    }

    selectStation(station: Station): void {
        this.connectStationService.selectStation(station);
    }

    updateFormValue(): void {
        const selectedStation = this.selectedStation();

        if (selectedStation) {
            const connectedStations = selectedStation.connectedTo.map(({ id }) => id);
            const controlNames = <keyof typeof this.connectionForm.controls>(
                (<unknown>Object.keys(this.connectionForm.controls))
            );

            this.connectionForm.setValue(pick(selectedStation, controlNames));

            this.connectedStationControl.setValue(connectedStations);
        }
    }

    addStation(): void {
        const { city } = this.connectionForm.controls;
        const connectionFormValue = this.connectionForm.getRawValue();
        const relations = this.connectedStationControl.getRawValue();
        const id = Date.now();

        const newStation: StationRequest = { ...connectionFormValue, relations, id };

        const isStationExists = this.stationList()
            ?.map(({ city }) => city)
            ?.includes(newStation.city);

        if (isStationExists) {
            city.setErrors({ err: 'Such station exists' });

            return;
        }

        this.updateOne.emit(newStation);
    }

    updateStation(): void {
        const relations = this.connectedStationControl.getRawValue();
        const selectedStation = this.selectedStation();

        if (!selectedStation) {
            return;
        }

        const updateStation: StationRequest = {
            ...omit(selectedStation, 'connectedTo'),
            relations,
        };

        this.updateOne.emit(updateStation);
    }

    submit(): void {
        if (this.isEditMode()) {
            return this.updateStation();
        }

        return this.addStation();
    }

    setLeaflet({ latlng }: LeafletMouseEvent) {
        if (!this.isEditMode()) {
            const { city } = this.connectionForm.controls;

            this.connectionForm.setValue({
                latitude: latlng.lat,
                longitude: latlng.lng,
                city: city.getRawValue(),
            });
        }
    }

    watchForModeUpdate(): void {
        effect(
            () => {
                if (this.selectedStation() && this.isEditMode()) {
                    this.updateFormValue();
                }
            },
            { injector: this.injector },
        );
    }

    get isFormValid(): boolean {
        return (
            this.connectedStationControl.valid &&
            this.connectedStationControl.dirty &&
            this.connectionForm.valid
        );
    }
}
