import { Pipe, PipeTransform } from '@angular/core';
import { Station } from '@interface/station.interface';
import { Marker, marker, icon, Icon } from 'leaflet';

@Pipe({
    name: 'toMarker',
    standalone: true,
})
export class ToMarkerPipe implements PipeTransform {
    transform(station: Station, eventCb: (station: Station) => void): Marker {
        const { city, latitude, longitude } = station;

        return marker([latitude, longitude], {
            icon: icon({
                ...Icon.Default.prototype.options,
                iconUrl: 'assets/marker-icon.png',
                iconRetinaUrl: 'assets/marker-icon-2x.png',
                shadowUrl: 'assets/marker-shadow.png',
            }),
        })
            .bindPopup(city)
            .bindTooltip(city)
            .addEventListener('click', () => {
                eventCb(station);
            });
    }
}
