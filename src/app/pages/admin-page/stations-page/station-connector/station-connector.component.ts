import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
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
import { LeafletMouseEvent } from 'leaflet';
import { GetControlErrorMessagePipe } from '@shared/pipes/get-control-error-message/get-control-error-message.pipe';
import { StationList, StationRequest } from '@type/station.type';
import { Store } from '@ngrx/store';
import { selectStationsEntities } from '@store/stations/stations.selectors';
import { withLatestFrom, map } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
    readonly stationList = input<StationList | null>();
    readonly createOne = output<StationRequest>();

    readonly selectedStation = this.connectStationService.selectedStation;
    readonly stationsEntities$ = this.store.select(selectStationsEntities);

    readonly connectionForm = this.formBuilder.nonNullable.group({
        city: ['', [required(), hasGaps]],
        latitude: [0, [required(), isLatitude]],
        longitude: [0, [required(), isLongitude]],
    });

    readonly connectedStationControl = this.formBuilder.nonNullable.control<number[]>([], {
        validators: ({ value }) => (value.length >= 3 ? null : { tag: 'At least three city' }),
    });

    constructor(
        private readonly store: Store,
        private readonly formBuilder: FormBuilder,
        private readonly connectStationService: ConnectStationService,
    ) {
        this.connectedStationControl.valueChanges
            .pipe(
                takeUntilDestroyed(),
                withLatestFrom(this.stationsEntities$),
                map(([ids, stationsEntities]) =>
                    ids.map(id => {
                        const station = stationsEntities[id];

                        return [station!.latitude, station!.longitude];
                    }),
                ),
            )
            .subscribe(latLng => {
                this.connectStationService.pathLine.set(latLng);
            });
    }

    selectStation(station: Station): void {
        this.connectStationService.selectStation(station);
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

        this.createOne.emit(newStation);
    }

    submit(): void {
        this.addStation();
        this.connectionForm.reset();
        this.connectedStationControl.reset();
    }

    setLeaflet({ latlng }: LeafletMouseEvent): void {
        const { city } = this.connectionForm.controls;

        this.connectionForm.setValue({
            latitude: latlng.lat,
            longitude: latlng.lng,
            city: city.getRawValue(),
        });
    }

    get isFormValid(): boolean {
        return this.connectedStationControl.valid && this.connectionForm.valid;
    }
}
