import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    computed,
    effect,
    input,
    output,
    signal,
} from '@angular/core';
import { LeafletModule } from '@bluehalo/ngx-leaflet';
import { MapOptions, tileLayer, latLng, LeafletMouseEvent, polyline, LatLngTuple } from 'leaflet';
import { Station } from '@interface/station.interface';
import { StationList } from '@type/station.type';
import { ToMarkerPipe } from '../../pipe/to-marker/to-marker.pipe';
import { ConnectStationService } from '../services/connect-station/connect-station.service';

@Component({
    selector: 'app-map',
    standalone: true,
    imports: [LeafletModule, ToMarkerPipe],
    templateUrl: './map.component.html',
    styleUrl: './map.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent {
    readonly stationList = input<StationList | null>();
    private latLngCash = latLng(35.00011067419652, -119.5076444176882);

    readonly selectLeaflet = output<LeafletMouseEvent>();

    readonly point = signal<LeafletMouseEvent | null>(null);

    readonly latLng = computed(() => {
        const selectedStation = this.connectStationService.selectedStation();

        if (selectedStation) {
            const { latitude, longitude } = selectedStation;

            this.latLngCash = latLng(latitude, longitude);

            return this.latLngCash;
        }

        return this.latLngCash;
    });

    lines = computed(() => {
        const point = this.point();
        const pathLines = [...this.connectStationService.pathLine()] as LatLngTuple[];

        if (point && pathLines.length > 1) {
            return polyline([...pathLines, [point.latlng.lat, point.latlng.lng]] as LatLngTuple[]);
        }

        return polyline([...pathLines]);
    });

    readonly options: MapOptions = {
        layers: [tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18 })],
        zoom: 5,
        center: this.latLngCash,
    };

    selectStation = (station: Station): void => {
        this.connectStationService.selectStation(station);
    };

    constructor(
        readonly connectStationService: ConnectStationService,
        c: ChangeDetectorRef,
    ) {
        effect(() => {
            if (this.lines()) {
                c.markForCheck();
            }
        });
    }
}
